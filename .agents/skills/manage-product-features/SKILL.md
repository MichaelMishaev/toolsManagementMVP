---
name: manage-product-features
description: Identify, classify, create, and update product feature records in this repository. Use when Codex is asked to capture a feature idea, compare a proposal with the PRD, decide MVP or later-phase suitability, record MCP exposure suitability, add a feature under docs/features, or update a feature's append-only JSON decision history.
---

# Manage Product Features

Maintain auditable feature specifications under `docs/features/` without silently changing the product scope defined in `docs/PRDs/PRD.md`.

## Workflow

1. Read `docs/PRDs/PRD.md` and the relevant feature records.
2. Search `docs/features/` for the same user outcome before creating anything. Update an existing record when the proposal is a duplicate or refinement.
3. Classify the proposal as one of:
   - `existing`: already required by the PRD;
   - `clarification`: makes an existing requirement testable without expanding its outcome;
   - `extension`: adds a useful outcome to the current product;
   - `future`: intentionally outside the current MVP;
   - `conflict`: contradicts an explicit PRD boundary.
4. Assign phase, priority, MVP suitability, and MCP suitability using `references/feature-schema.md`.
5. Create `docs/features/FT-###-slug/feature.md` and `history.json` from the reference templates. Select the next unused numeric ID; never reuse an ID.
6. Write one concrete user example and name the exact screen and role affected.
7. Keep unresolved product choices in `Open Questions`; do not decide them by assumption.
8. On later changes, update `feature.md`, update `current` in `history.json`, and append a new history item. Never rewrite or delete older history entries.
9. Run `python3 .agents/skills/manage-product-features/scripts/validate_features.py docs/features` and resolve every reported error.

## Phase Rules

- `phase-1`: required for the core request-to-closure workflow, reuses existing data, and does not introduce an excluded system.
- `phase-1.1`: valuable early follow-up or conditional addition that should not block the initial end-to-end release.
- `phase-2`: a meaningful expansion such as QR entry, external messaging, preventive maintenance, or an integration.
- `phase-3`: advanced optimization or enterprise capability.
- `backlog`: useful idea without an approved delivery phase.

An explicitly excluded PRD capability cannot be marked `phase-1` unless the PRD is deliberately changed by the product owner.

## MVP Suitability

Use `recommended` when the feature directly strengthens the core MVP with contained scope. Use `conditional` when client input or a prerequisite is missing. Use `not-suitable` when it belongs to a later phase or conflicts with an MVP boundary.

## MCP Suitability

Treat MCP suitability as a separate integration assessment, not as delivery approval:

- `read-only`: safe candidate for lookup or reporting tools.
- `assistive`: MCP may prepare or validate data, but a human must confirm consequential writes.
- `read-write`: appropriate only for bounded, authorized mutations with audit history.
- `not-applicable`: the user-facing feature gains no clear value from MCP exposure.

Never make authentication, authorization, signatures, call closure, or customer-visible communication autonomous merely because MCP exposure is technically possible.

## Record Quality

- Use stable PRD requirement IDs in `PRD Alignment`.
- Distinguish current PRD behavior from proposed work.
- Keep acceptance criteria observable and implementation-neutral.
- Link competitor inspiration only when it explains a product pattern; it does not override the PRD.
- Store all dates as `YYYY-MM-DD` and all history versions as increasing integers.
- Keep JSON valid and free of comments.

Read `references/feature-schema.md` before creating or changing a feature record.
