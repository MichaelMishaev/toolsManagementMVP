# FT-006 — Downloadable Branded Service Report

| Field | Value |
|---|---|
| Status | Proposed |
| Phase | Phase 1 |
| Priority | P0 |
| MVP suitability | Recommended |
| PRD relationship | Extension |

## Summary

Generate a branded, downloadable PDF for every closed call using the service-report data already required by the PRD.

## User Example

After a lift-platform repair is closed, the customer opens the completed call and downloads a signed PDF containing the fault, treatment, parts, photos, technician, and customer signature.

## Roles and Screens

| Role | Screen | Change |
|---|---|---|
| Customer | Call history → Service report | View and download the signed PDF. |
| Service Desk / Manager | Closed call → Service report | Preview and download the same canonical report. |

## Scope

- Create the PDF from the canonical closed-call record.
- Include company branding, call/customer/equipment data, treatment, parts, photos, technician identity, signature, and timestamps.
- Preserve access rules when viewing or downloading a report.

## Acceptance Criteria

- [ ] Every successfully closed call has one canonical downloadable report.
- [ ] The PDF matches the stored call and signature data.
- [ ] Customers can access only reports belonging to their account.
- [ ] Hebrew text and RTL layout render correctly in the PDF.

## PRD Alignment

- Related requirements: `FR-1.8`, `FR-2.7`, `FR-3.10`, Section 6.
- Relationship: the PRD requires report generation and viewing but does not explicitly require a downloadable PDF.

## Competitor Inspiration

- [Synchroteam](https://www.synchroteam.com/) — customer portal downloads for PDF job reports.
- [Zoho FSM](https://www.zoho.com/fsm/) — branded service-report PDF templates.

## Out of Scope

- Invoices, receipts, or payment documents.
- Customer editing of a finalized report.

## Open Questions

- Should photos appear inline in the PDF or as separate attachments?
