# FT-010 — Equipment QR Service Request

| Field | Value |
|---|---|
| Status | Proposed |
| Phase | Phase 2 |
| Priority | P1 |
| MVP suitability | Not suitable for current MVP |
| PRD relationship | Future |

## Summary

Place a QR code on each equipment record so scanning it opens a service-request form already linked to the correct equipment and customer context.

## User Example

A warehouse employee scans the QR code on a forklift, describes the fault, adds a photo, and submits a request without manually searching for the equipment number.

## Roles and Screens

| Role | Screen | Change |
|---|---|---|
| Customer / Authorized site user | QR scan → Prefilled service request | Open a request linked to the scanned equipment. |
| Service Desk | New-call queue | See that the call originated from a verified equipment QR link. |
| Service Manager | Equipment details | Generate or replace the equipment QR code. |

## Scope

- Generate a stable, revocable QR identifier per equipment record.
- Prefill equipment context without exposing private customer information publicly.
- Apply rate limiting, validation, and account/site authorization according to the selected access model.

## Acceptance Criteria

- [ ] Scanning a valid QR code opens the correct equipment request flow.
- [ ] The public URL does not reveal raw database identifiers or private equipment data.
- [ ] Revoked or invalid codes cannot create a linked request.
- [ ] Submitted requests enter the normal service-desk workflow and audit trail.

## PRD Alignment

- Related requirements: `FR-1.3`, `FR-1.4`, `FR-4.4`; Section 11.
- Relationship: explicitly identified by the PRD as a possible future phase, not current MVP scope.

## Competitor Inspiration

- [FieldEx](https://www.fieldex.com/en) — QR-based equipment fault reporting without requiring app installation.

## Out of Scope

- Phase 1 delivery.
- Public access to equipment history, customer details, or technician information.
- QR-based inventory or warehouse management.

## Open Questions

- Must the scanner be logged in, or may an authorized site use a limited no-login form?
- Who prints, installs, and replaces physical QR labels?
