# FT-001 — Technician Equipment Service History

| Field | Value |
|---|---|
| Status | Proposed |
| Phase | Phase 1 |
| Priority | P0 |
| MVP suitability | Recommended |
| PRD relationship | Extension |

## Summary

Let the assigned technician view recent service history for the equipment linked to a call, including prior faults, treatment summaries, parts used, dates, and outcomes.

## User Example

A technician opens a call for forklift `FL-204` and sees that the same hydraulic leak was repaired twice in the last three months, helping them arrive with the right context and parts.

## Roles and Screens

| Role | Screen | Change |
|---|---|---|
| Technician | Assigned call → Equipment history | View chronological service history for the linked equipment. |
| Service Desk / Manager | Call details → Equipment history | Use the same history when triaging or reviewing a call. |

## Scope

- Show service date, call number, fault summary, treatment summary, final status, technician, and parts used.
- Limit technician access to equipment attached to calls currently assigned to them.
- Provide an empty state when no prior service exists.

## Acceptance Criteria

- [ ] An assigned technician can open the linked equipment history from the call.
- [ ] History is ordered newest first and identifies each source call.
- [ ] Technicians cannot browse unrelated customers or equipment.
- [ ] Historical records are read-only from this view.

## PRD Alignment

- Related requirements: `FR-3.2`, `FR-3.3`, `FR-4.6`, Section 7.
- Relationship: the PRD stores equipment-level history but does not explicitly expose it to the assigned technician.

## Competitor Inspiration

- [FieldEx](https://www.fieldex.com/en) — machine-level repair and parts history.
- [MobileFrame](https://www.mobileframe.com/solutions/field-service-software/) — equipment history delivered to field technicians.

## Out of Scope

- Predictive diagnostics or automated repair recommendations.
- Editing or deleting historical service records.

## Open Questions

- How many historical calls should load initially on a mobile device?
