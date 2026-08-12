# FT-005 — Customer Appointment Visibility

| Field | Value |
|---|---|
| Status | Proposed |
| Phase | Phase 1 |
| Priority | P0 |
| MVP suitability | Recommended |
| PRD relationship | Extension |

## Summary

Show the scheduled service date, time window, current status, and assigned technician identity in the customer’s active-call view after scheduling.

## User Example

A customer opens an active call and sees that technician Daniel is scheduled for Tuesday between 10:00 and 12:00, eliminating the need to call the service desk for confirmation.

## Roles and Screens

| Role | Screen | Change |
|---|---|---|
| Customer | Personal area → Active call | View the confirmed appointment window and assigned technician. |
| Service Desk | Call scheduling | Preview the customer-visible appointment information. |

## Scope

- Show treatment date, time window, status, and assigned technician name once confirmed.
- Update the customer view when the desk reschedules or reassigns the call.
- Preserve an audit event for schedule changes under the existing history model.

## Acceptance Criteria

- [ ] A scheduled call displays its date and time window to the customer.
- [ ] Reassignment or rescheduling updates the visible appointment details.
- [ ] Unscheduled calls show a clear pending-scheduling state.
- [ ] Internal desk notes remain hidden from the customer.

## PRD Alignment

- Related requirements: `FR-1.7`, `FR-2.4`, `FR-2.5`, Section 7.
- Relationship: the customer can see call status, but appointment and technician visibility are not explicit.

## Competitor Inspiration

- [Synchroteam](https://www.synchroteam.com/) — customer portal and job status visibility.
- [Praxedo](https://www.praxedo.com/) — customer work-order tracking and appointment support.

## Out of Scope

- A live technician map or continuously updated ETA.
- External SMS or WhatsApp appointment notifications.

## Open Questions

- Should the customer see the technician’s phone number or only their name?
