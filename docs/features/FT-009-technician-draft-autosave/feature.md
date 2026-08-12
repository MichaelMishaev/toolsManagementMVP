# FT-009 — Technician Treatment Draft Autosave

| Field | Value |
|---|---|
| Status | Proposed |
| Phase | Phase 1.1 |
| Priority | P1 |
| MVP suitability | Conditional |
| PRD relationship | Extension |

## Summary

Preserve an in-progress technician treatment form on the device so a temporary connection loss, refresh, or accidental navigation does not erase entered notes.

## User Example

A technician enters a long repair summary in a basement with unstable reception. The page reloads, but the unfinished summary and selections are restored instead of being lost.

## Roles and Screens

| Role | Screen | Change |
|---|---|---|
| Technician | Assigned call → Treatment form | Automatically restore the latest unsent local draft. |

## Scope

- Autosave unsent text and structured selections locally on the technician’s device.
- Clearly distinguish a local draft from server-saved call data.
- Remove the local draft after successful submission or an explicit discard action.

## Acceptance Criteria

- [ ] Entered treatment text survives refresh or temporary navigation on the same device.
- [ ] The interface communicates when a local draft was restored.
- [ ] Successful submission clears the matching local draft.
- [ ] Drafts are isolated by technician account and call.

## PRD Alignment

- Related requirements: `FR-3.5`–`FR-3.10`; Section 10 excludes full offline support.
- Relationship: adds limited form resilience without promising offline call synchronization.

## Competitor Inspiration

- [Praxedo](https://www.praxedo.com/) — offline-capable technician mobile workflow.
- [FieldAware](https://www.gpsinsight.com/fieldaware/) — field updates and signatures in mobile conditions.

## Out of Scope

- Full offline browsing, status updates, photo upload queues, or multi-device draft synchronization.
- Storing customer signatures in an unsubmitted local draft.

## Open Questions

- Which non-sensitive fields may be stored locally under the company’s device-security policy?
