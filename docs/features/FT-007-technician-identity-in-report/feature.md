# FT-007 — Technician Identity in Service Report

| Field | Value |
|---|---|
| Status | Proposed |
| Phase | Phase 1 |
| Priority | P0 |
| MVP suitability | Recommended |
| PRD relationship | Extension |

## Summary

Include the assigned technician’s name and the call closure timestamp as explicit fields in every service report and closed-call view.

## User Example

A service manager reviews a customer dispute and can immediately see that technician Amir Cohen completed and closed the call on 11 August 2026 at 15:42.

## Roles and Screens

| Role | Screen | Change |
|---|---|---|
| Customer | Completed call / Service report | See who performed the service and when it closed. |
| Service Desk / Manager | Closed call / Service report | Use technician identity for accountability and follow-up. |

## Scope

- Show the technician’s display name and closure date/time.
- Preserve the historical technician identity even if the user account later changes.
- Include the same values in the downloadable report.

## Acceptance Criteria

- [ ] Every closed-call report names the technician who performed the closure.
- [ ] The report contains the closure timestamp in the company’s local timezone.
- [ ] Reassignment history remains available through the audit trail.
- [ ] Technician identity is consistent across the UI and PDF report.

## PRD Alignment

- Related requirements: `FR-2.4`, `FR-3.10`, Section 6, candidate `CR-3`.
- Relationship: assignment exists, but technician identity is missing from the formal report schema.

## Competitor Inspiration

- [MobileFrame](https://www.mobileframe.com/solutions/field-service-software/) — work-order records identify work performed and signatures.
- [ServiceTrade](https://servicetrade.com/) — technician and equipment context in customer service history.

## Out of Scope

- Technician performance scoring or public ratings.
- Exposing private technician contact details.

## Open Questions

- Should the report show one technician or every technician who participated in the call?
