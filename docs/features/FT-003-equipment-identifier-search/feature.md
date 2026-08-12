# FT-003 — Equipment Identifier Search

| Field | Value |
|---|---|
| Status | Proposed |
| Phase | Phase 1 |
| Priority | P0 |
| MVP suitability | Recommended |
| PRD relationship | Extension |

## Summary

Allow service staff to locate equipment using its internal number, chassis or serial number, customer, or equipment type.

## User Example

A caller provides only the chassis number. The service-desk agent searches that number, finds the correct lift platform and customer site, and opens the call against the right asset.

## Roles and Screens

| Role | Screen | Change |
|---|---|---|
| Service Desk | Equipment search / New call | Find the correct equipment while handling a request. |
| Service Manager | Equipment list | Search and review equipment across customers. |

## Scope

- Search internal number, chassis or serial number, customer name, and equipment type.
- Show customer, work site, active state, and identifying numbers in results.
- Prevent customer users from searching equipment outside their own account.

## Acceptance Criteria

- [ ] Exact identifier searches return the matching equipment.
- [ ] Partial text search works for customer and equipment type.
- [ ] Results distinguish duplicate equipment types using identifiers and customer/site data.
- [ ] Access rules remain enforced for every result.

## PRD Alignment

- Related requirements: `FR-4.4`, `FR-4.5`, `FR-4.6`.
- Relationship: equipment identifiers are stored, but searchable lookup is not explicitly required.

## Competitor Inspiration

- [FieldEx](https://www.fieldex.com/en) — asset lookup by serial number.
- [ServiceTrade](https://servicetrade.com/) — equipment and service context for field-service teams.

## Out of Scope

- Barcode or QR scanning.
- Fuzzy matching that automatically merges equipment records.

## Open Questions

- Should inactive equipment appear by default or only through a filter?
