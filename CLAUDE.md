# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A documentation/static-site repository containing the MVP specification for a field-service management platform used by an Israeli company that services **forklifts, aerial/scissor lift platforms, and other mechanical equipment** (not elevators). The core workflow runs from a customer fault report through service-desk triage, technician assignment and field work, customer signature, call closure, and generation of a service report.

This is presently *only* the specification, not an application implementation — there is no framework, backend, database, or auth model. Don't invent one unless explicitly asked to begin implementation.

An `AGENTS.md` in the repo root carries the equivalent guidance for Codex/other agents. Keep shared facts (scope, sources of truth, boundaries) consistent between the two files when they materially change.

## Sources of truth (in this priority order)

1. The `.pages` document under `docs/PRDs/` — the original Apple Pages client specification, and the highest-priority source. It's a binary iWork bundle (zip of protobuf `.iwa` files), not directly readable — to extract its text: open it in Pages.app and export to PDF (e.g. via `osascript`), then run `pdftotext` (poppler).
2. `docs/PRDs/PRD.md` — the structured English PRD derived from that source (functional requirements with `FR-*` IDs, status lifecycle, report schema, out-of-scope list, and a Discovery Notes Traceability section with `CR-*` candidate requirements). Read this before making product-scope decisions.
3. `docs/clientSystemAnaluse_1.html` — the Hebrew, client-facing presentation of the same specification.

If the PRD and HTML conflict with the original `.pages` source, report the discrepancy rather than silently resolving it. Items under "Candidate requirements" or "Open Questions" in the PRD are unresolved — not committed MVP scope — and should not be promoted into the spec without an explicit product decision.

## Technician design references

`design/design.md` documents three unapproved technician-mobile design directions. It is a design handoff and implementation guide, not a product source of truth; the original Pages specification, `docs/PRDs/PRD.md`, and `docs/clientSystemAnaluse_1.html` remain authoritative in that order.

The matching raster references are in `design/temp/`:

- `01-next-job-command.png` — action-first next-call home;
- `02-route-timeline.png` — ordered daily schedule/timeline;
- `03-compact-service-queue.png` — dense assigned-call queue.

Do not silently select a direction or promote an exploratory affordance into MVP scope. Map/GPS navigation remains candidate requirement CR-4, the route visualisation must not imply route optimization, and the queue's filtering/"next call" rules require a product decision. Preserve Hebrew-first RTL, mobile-first behavior, the shared design language, and the requirement/scope notes in `design/design.md` when updating a direction or translating it into Figma/code.

## Current MVP boundaries

**Included:** customer, service-desk, technician, service-manager, and basic warehouse/parts roles; customer and equipment records; service-call handling; technician documentation; parts used; customer signature; service reports; history/audit events; in-system notifications. Intended to run as a PWA once implemented.

**Explicitly excluded:** full inventory and purchasing, accounting/invoicing integration, ERP or Ituran integration, automatic WhatsApp/SMS delivery, full offline support, preventive-maintenance scheduling, core video attachments, and store-published native apps.

## Serving / previewing

No build step configured. To preview locally, serve the repo root and open the HTML document:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000/docs/clientSystemAnaluse_1.html`.

## Feature proposals (`docs/features/`)

Proposed/extension features (as opposed to the core PRD spec) are tracked as individual auditable records under `docs/features/FT-###-slug/`, each with:

- `feature.md` — human-readable spec (summary, user example, roles/screens, scope, acceptance criteria, PRD alignment via `FR-*` IDs, competitor inspiration, out-of-scope, open questions);
- `history.json` — append-only decision history plus a `current` block (status, phase, priority, MVP suitability, MCP suitability, PRD alignment).

The governing workflow lives in `.agents/skills/manage-product-features/SKILL.md` (with `references/feature-schema.md` for field definitions). Key rules if you create or edit a feature record:

- Search existing `docs/features/` records for the same outcome before adding a new one; update in place if it's a duplicate/refinement.
- Classify each proposal as `existing` / `clarification` / `extension` / `future` / `conflict` relative to the PRD — a capability the PRD explicitly excludes cannot be marked `phase-1` without a deliberate PRD change.
- Never rewrite or delete prior `history.json` entries — append a new version instead.
- After creating/editing a record, validate it:

```sh
python3 .agents/skills/manage-product-features/scripts/validate_features.py docs/features
```

This is the only automated check in the repo — run it whenever `docs/features/` changes.

The page is deployed via GitHub Pages directly from the repo root at:
https://michaelmishaev.github.io/toolsManagementMVP/

The live site currently reflects the last committed `index.html` at repo root — the move into `docs/` is a local, uncommitted reorganization (`git status` before assuming what's deployed matches what's on disk).

## Structure of the spec HTML

The document is one long page assembled from `<section>` blocks (in reading order), each independently addressable via nav anchors:

`summary` → `flow` → `users` (+ persona tabs) → `analysis` → `scope` → `rules` → `screens` → `report` → `notifications` → `boundaries` → `roadmap` → `client-inputs` → `acceptance` → `approval`

Key interactive pieces implemented in the single inline `<script>` block near the end of the file:
- **Sticky nav + scroll spy**: `IntersectionObserver` over the sections above toggles `aria-current` on matching nav links as the reader scrolls.
- **Read progress bar** (`#readProgress`): width driven by scroll position, recalculated on `scroll`/`resize`.
- **Persona tab switcher** (`.tab-button` / `.tab-panel`, e.g. `panel-customer`, `panel-manager`, `panel-tech`, `panel-center`): standard ARIA tabs with left/right arrow-key navigation.
- **Status simulator** (`.status-button` + `#demoStatus`/`#statusOwner`/`#statusText`): a small demo that walks through the service-call lifecycle (`פתוחה` → `שובצה לטכנאי` → `מתואמת` → `טכנאי בדרך` → `בטיפול` → `ממתין לחלפים` → `נסגרה`), driven by the `statusData` lookup object — each status maps to an "owner" (who's responsible) and a description.
- **Print handling**: `beforeprint`/`afterprint` listeners force-open any collapsed `<details class="module">` elements so printed/PDF output isn't missing collapsed content, then restore their state.

All styling is in the single inline `<style>` block using CSS custom properties defined on `:root` (`--ink`, `--accent`, `--canvas`, `--radius-*`, etc.) — reuse these tokens rather than hardcoding new colors/spacing when editing. The page must remain `lang="he"` `dir="rtl"`; keep client-facing content in natural Hebrew and the existing tone.

## Working conventions

- When editing the status simulator or persona tabs, update `statusData` / the corresponding `tab-panel` markup together — the JS assumes their keys and `aria-controls`/`id` pairs stay in sync.
- Use the stable `FR-*`/`CR-*` requirement IDs from `docs/PRDs/PRD.md` when discussing or changing functional scope, and preserve its traceability distinctions (confirmed vs. deferred vs. candidate vs. open question).
- Inspect `git status` before editing — preserve existing uncommitted work and don't undo file moves or unrelated changes.
- Treat the deployed GitHub Pages site and the local working tree as separate states; verify both before claiming a change is live.
- No automated verification exists: for content-only changes, check the PRD/HTML diff directly; for UI/interaction changes, load the page in a real browser, exercise the changed interaction, and confirm RTL layout and keyboard/accessibility behavior.
