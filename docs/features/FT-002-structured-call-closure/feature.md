# FT-002 — Structured Service Call Closure

| Field | Value |
|---|---|
| Status | Proposed |
| Phase | Phase 1 |
| Priority | P0 |
| MVP suitability | Recommended |
| PRD relationship | Clarification |

## Summary

Turn call closure into a structured checklist so every completed service report contains the required treatment, parts, evidence, follow-up, and signature information.

## User Example

A technician taps “Close call.” The system shows that the treatment summary and signer name are complete, asks them to confirm that no parts were used, and blocks closure until the customer signature is captured.

## Roles and Screens

| Role | Screen | Change |
|---|---|---|
| Technician | Call → Close call | Complete and validate the closure checklist. |
| Service Desk / Manager | Closed call → Service report | Receive a consistent, complete report. |

## Scope

- Require a treatment summary, result, follow-up-required flag, parts-used declaration, signer name, signature, and closure timestamp.
- Allow explicit “none used” and “not applicable” choices where valid.
- Show missing items before the technician submits closure.

## Acceptance Criteria

- [ ] A call cannot close while a mandatory closure field is missing.
- [ ] The technician can explicitly state that no parts were used.
- [ ] The generated service report contains all captured closure data.
- [ ] Failed validation preserves all entered information.

## PRD Alignment

- Related requirements: `FR-3.6`–`FR-3.10`, Section 6, Section 7.
- Relationship: clarifies how existing closure requirements become a complete and testable workflow.

## Competitor Inspiration

- [Zoho FSM](https://www.zoho.com/fsm/) — job sheets, service reports, signatures, and completion records.
- [Praxedo](https://www.praxedo.com/) — structured mobile work-order reporting.

## Out of Scope

- Customer payment collection or invoice generation.
- Automatically closing a call through AI or an integration.

## Open Questions

- Are completion photos mandatory for every call or only selected fault types?
