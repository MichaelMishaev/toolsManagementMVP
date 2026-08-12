# FT-008 — Structured Fault Type and Category

| Field | Value |
|---|---|
| Status | Proposed |
| Phase | Phase 1.1 |
| Priority | P1 |
| MVP suitability | Conditional |
| PRD relationship | Extension |

## Summary

Add structured fault type and category fields to service-call creation while retaining the customer’s required free-text description and an “Other” option.

## User Example

A customer selects “Hydraulics → Leak,” writes where the leak appears, and attaches a photo. The service desk can then filter similar open calls without losing the customer’s detailed explanation.

## Roles and Screens

| Role | Screen | Change |
|---|---|---|
| Customer | New service call | Select a fault type/category and provide free text. |
| Service Desk / Manager | Call queue and filters | Filter and report by structured fault classification. |
| Technician | Assigned call details | See both the selected category and original description. |

## Scope

- Use a client-approved fault taxonomy.
- Include an “Other” option that requires free text.
- Preserve the original category value on historical calls if the taxonomy later changes.

## Acceptance Criteria

- [ ] A customer can select an active fault category during call creation.
- [ ] Free-text fault description remains available and required according to business rules.
- [ ] Desk users can filter calls by fault type/category.
- [ ] Historical calls remain readable after taxonomy updates.

## PRD Alignment

- Related requirements: `FR-1.3`, `FR-1.5`, `FR-3.3`, candidate `CR-1`, Section 12.
- Relationship: discovery proposed structured categories, but the client-approved taxonomy is still missing.

## Competitor Inspiration

- [IFS Field Service Management](https://www.ifs.com/en/products/fsm) — structured service and asset workflows.
- [Zoho FSM](https://www.zoho.com/fsm/) — configurable work-order and job-sheet data.

## Out of Scope

- AI classification of customer descriptions.
- Automatically changing urgency based on fault type.

## Open Questions

- Who owns and approves the initial fault taxonomy?
- Is the taxonomy shared across all equipment types?
