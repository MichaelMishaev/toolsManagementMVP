# FT-004 — One-Tap Navigation to Customer Site

| Field | Value |
|---|---|
| Status | Proposed |
| Phase | Phase 1 |
| Priority | P0 |
| MVP suitability | Recommended |
| PRD relationship | Extension |

## Summary

Give technicians a one-tap action that opens the call’s work-site address in Waze or Google Maps.

## User Example

A technician reviews the next assigned call, taps “Navigate,” and Waze opens with the customer’s work-site address as the destination.

## Roles and Screens

| Role | Screen | Change |
|---|---|---|
| Technician | Assigned call → Header/actions | Open the work-site destination in a supported navigation app. |

## Scope

- Build a navigation deep link from the work-site address.
- Offer Waze and Google Maps when both are supported.
- Show the written address and a clear error when it is incomplete.

## Acceptance Criteria

- [ ] “Navigate” is visible when a usable work-site address exists.
- [ ] The selected navigation app opens with the correct destination.
- [ ] No technician location is stored or shared by this feature.
- [ ] Missing addresses produce an actionable message instead of a broken link.

## PRD Alignment

- Related requirements: `FR-3.2`, `FR-4.3`, candidate `CR-4`.
- Relationship: promotes an unresolved discovery candidate into a contained Phase 1 proposal.

## Competitor Inspiration

- [Zoho FSM](https://www.zoho.com/fsm/) — technician navigation to job sites.
- [Synchroteam](https://www.synchroteam.com/) — map-based field-team workflow.

## Out of Scope

- Live GPS tracking, route optimization, or automatic dispatch.
- Recording the technician’s travel path.

## Open Questions

- Should the company choose one default navigation provider?
