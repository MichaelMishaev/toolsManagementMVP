#!/usr/bin/env python3
"""Validate feature Markdown and JSON records."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ALLOWED = {
    "status": {"proposed", "approved", "in-progress", "implemented", "deferred", "rejected"},
    "phase": {"phase-1", "phase-1.1", "phase-2", "phase-3", "backlog"},
    "priority": {"P0", "P1", "P2", "P3"},
    "mvp": {"recommended", "conditional", "not-suitable"},
    "mcp": {"read-only", "assistive", "read-write", "not-applicable"},
    "alignment": {"existing", "clarification", "extension", "future", "conflict"},
}

REQUIRED_HEADINGS = {
    "## Summary",
    "## User Example",
    "## Roles and Screens",
    "## Scope",
    "## Acceptance Criteria",
    "## PRD Alignment",
    "## Competitor Inspiration",
    "## Out of Scope",
    "## Open Questions",
}


def require(mapping: dict, key: str, context: str, errors: list[str]):
    if key not in mapping:
        errors.append(f"{context}: missing {key}")
        return None
    return mapping[key]


def validate_record(folder: Path) -> list[str]:
    errors: list[str] = []
    match = re.fullmatch(r"(FT-\d{3})-([a-z0-9]+(?:-[a-z0-9]+)*)", folder.name)
    if not match:
        return [f"{folder}: folder name must match FT-###-slug"]

    feature_id, folder_slug = match.groups()
    markdown_path = folder / "feature.md"
    history_path = folder / "history.json"
    if not markdown_path.is_file():
        errors.append(f"{folder}: missing feature.md")
    if not history_path.is_file():
        errors.append(f"{folder}: missing history.json")
    if errors:
        return errors

    markdown = markdown_path.read_text(encoding="utf-8")
    if not markdown.startswith(f"# {feature_id} — "):
        errors.append(f"{markdown_path}: title must start with '# {feature_id} — '")
    headings = {line.strip() for line in markdown.splitlines() if line.startswith("## ")}
    for heading in sorted(REQUIRED_HEADINGS - headings):
        errors.append(f"{markdown_path}: missing heading {heading}")

    try:
        data = json.loads(history_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return errors + [f"{history_path}: invalid JSON: {exc}"]

    for key in ("schema_version", "feature_id", "slug", "title", "current", "history"):
        require(data, key, str(history_path), errors)
    if errors:
        return errors
    if data["schema_version"] != 1:
        errors.append(f"{history_path}: schema_version must be 1")
    if data["feature_id"] != feature_id:
        errors.append(f"{history_path}: feature_id must match folder")
    if data["slug"] != folder_slug:
        errors.append(f"{history_path}: slug must match folder")

    current = data["current"]
    if not isinstance(current, dict):
        return errors + [f"{history_path}: current must be an object"]
    for key in ("status", "phase", "priority", "mvp_suitability", "mcp_suitability", "prd_alignment"):
        require(current, key, f"{history_path}: current", errors)
    if errors:
        return errors
    for key, allowed_key in (("status", "status"), ("phase", "phase"), ("priority", "priority")):
        if current[key] not in ALLOWED[allowed_key]:
            errors.append(f"{history_path}: invalid {key} {current[key]!r}")

    mvp = current["mvp_suitability"]
    mcp = current["mcp_suitability"]
    alignment = current["prd_alignment"]
    for obj, keys, label in (
        (mvp, ("suitable", "classification", "reason"), "mvp_suitability"),
        (mcp, ("applicable", "mode", "reason"), "mcp_suitability"),
        (alignment, ("type", "references", "notes"), "prd_alignment"),
    ):
        if not isinstance(obj, dict):
            errors.append(f"{history_path}: {label} must be an object")
            continue
        for key in keys:
            require(obj, key, f"{history_path}: {label}", errors)
    if isinstance(mvp, dict) and mvp.get("classification") not in ALLOWED["mvp"]:
        errors.append(f"{history_path}: invalid MVP classification")
    if isinstance(mvp, dict) and not isinstance(mvp.get("suitable"), bool):
        errors.append(f"{history_path}: mvp_suitability.suitable must be boolean")
    if isinstance(mcp, dict) and mcp.get("mode") not in ALLOWED["mcp"]:
        errors.append(f"{history_path}: invalid MCP mode")
    if isinstance(mcp, dict) and not isinstance(mcp.get("applicable"), bool):
        errors.append(f"{history_path}: mcp_suitability.applicable must be boolean")
    if isinstance(alignment, dict) and alignment.get("type") not in ALLOWED["alignment"]:
        errors.append(f"{history_path}: invalid PRD alignment type")

    history = data["history"]
    if not isinstance(history, list) or not history:
        errors.append(f"{history_path}: history must be a non-empty array")
    else:
        versions = []
        for index, entry in enumerate(history, start=1):
            if not isinstance(entry, dict):
                errors.append(f"{history_path}: history item {index} must be an object")
                continue
            for key in ("version", "date", "action", "actor", "source", "summary"):
                require(entry, key, f"{history_path}: history item {index}", errors)
            versions.append(entry.get("version"))
            if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(entry.get("date", ""))):
                errors.append(f"{history_path}: history item {index} has invalid date")
        if versions != list(range(1, len(history) + 1)):
            errors.append(f"{history_path}: history versions must be sequential from 1")
    return errors


def main() -> int:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "docs/features")
    if not root.is_dir():
        print(f"Feature root does not exist: {root}", file=sys.stderr)
        return 2
    folders = sorted(path for path in root.iterdir() if path.is_dir())
    errors = [error for folder in folders for error in validate_record(folder)]
    seen_ids: dict[str, Path] = {}
    for folder in folders:
        match = re.match(r"(FT-\d{3})-", folder.name)
        if not match:
            continue
        feature_id = match.group(1)
        if feature_id in seen_ids:
            errors.append(
                f"{folder}: duplicate feature ID {feature_id}; first used by {seen_ids[feature_id]}"
            )
        else:
            seen_ids[feature_id] = folder
    if errors:
        print("\n".join(f"ERROR: {error}" for error in errors), file=sys.stderr)
        return 1
    print(f"Validated {len(folders)} feature record(s) in {root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
