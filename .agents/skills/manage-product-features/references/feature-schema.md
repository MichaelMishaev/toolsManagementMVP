# Feature Record Schema

## Directory layout

```text
docs/features/
└── FT-001-example-feature/
    ├── feature.md
    └── history.json
```

Use an uppercase `FT-###` identifier and a lowercase hyphenated slug. Never reuse an identifier, including from a rejected or removed feature.

## `feature.md` template

```markdown
# FT-001 — Feature title

| Field | Value |
|---|---|
| Status | Proposed |
| Phase | Phase 1 |
| Priority | P0 |
| MVP suitability | Recommended |
| PRD relationship | Extension |

## Summary

One outcome-focused paragraph.

## User Example

A concrete example showing the user, context, action, and result.

## Roles and Screens

| Role | Screen | Change |
|---|---|---|
| Technician | Call details | Exact visible capability |

## Scope

- Included behavior.

## Acceptance Criteria

- [ ] Observable result.

## PRD Alignment

- Related requirements: `FR-X.Y`.
- Relationship: existing, clarification, extension, future, or conflict.

## Competitor Inspiration

- [Product](https://example.com/) — pattern being considered.

## Out of Scope

- Explicitly excluded adjacent capability.

## Open Questions

- Unresolved choice, or `None.`
```

## `history.json` shape

```json
{
  "schema_version": 1,
  "feature_id": "FT-001",
  "slug": "example-feature",
  "title": "Feature title",
  "current": {
    "status": "proposed",
    "phase": "phase-1",
    "priority": "P0",
    "mvp_suitability": {
      "suitable": true,
      "classification": "recommended",
      "reason": "Why it belongs or does not belong in the MVP."
    },
    "mcp_suitability": {
      "applicable": true,
      "mode": "read-only",
      "reason": "What an MCP tool could safely do."
    },
    "prd_alignment": {
      "type": "extension",
      "references": ["FR-X.Y"],
      "notes": "How this relates to the governing PRD."
    }
  },
  "history": [
    {
      "version": 1,
      "date": "2026-08-11",
      "action": "created",
      "actor": "Codex",
      "source": "product-review",
      "summary": "Initial feature record created."
    }
  ]
}
```

## Allowed values

- `status`: `proposed`, `approved`, `in-progress`, `implemented`, `deferred`, `rejected`
- `phase`: `phase-1`, `phase-1.1`, `phase-2`, `phase-3`, `backlog`
- `priority`: `P0`, `P1`, `P2`, `P3`
- `mvp_suitability.classification`: `recommended`, `conditional`, `not-suitable`
- `mcp_suitability.mode`: `read-only`, `assistive`, `read-write`, `not-applicable`
- `prd_alignment.type`: `existing`, `clarification`, `extension`, `future`, `conflict`

## History rules

- Treat `history` as append-only.
- Start with version `1`; increment by exactly one.
- Record the decision that changed, not a generic edit message.
- Update `current` to match the newest history decision.
- Never include secrets, personal customer data, or implementation credentials.
