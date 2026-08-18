# FT-011 — WhatsApp-First Commercial Leads

| Field | Value |
|---|---|
| Status | Implemented |
| Phase | Phase 1.1 |
| Priority | P0 |
| MVP suitability | Recommended for commercial launch |
| PRD relationship | Extension |

## Summary

Give visitors one prominent, low-friction WhatsApp or phone contact path while carrying the page and available campaign context into the visitor-visible WhatsApp draft.

## User Example

A contractor arrives from a paid campaign, browses the desktop equipment catalogue, taps the single green WhatsApp action in the header, sees a draft that includes qualification prompts and the campaign source, edits it, and chooses whether to send it to the sales team.

## Roles and Screens

| Role | Screen | Change |
|---|---|---|
| Public visitor | Commercial homepage — desktop hero | See one primary WhatsApp action and the published sales phone number. |
| Public visitor | Commercial homepage — mobile contact dock | See one persistent WhatsApp action and one tap-to-call action without repeated WhatsApp buttons in page sections. |
| Public visitor | Equipment catalogue — desktop header | See one green WhatsApp consultation action without repeated actions on model cards. |
| Sales representative | WhatsApp conversation | Receive the visitor-approved draft with page and available campaign context. |
| Marketing owner | Future analytics consumer | Use the emitted `lead_intent_opened` browser event after an approved analytics destination is configured. |

## Scope

- Publish the approved commercial phone number as a tap-to-call action.
- Show one WhatsApp conversion action per homepage viewport: hero on desktop/tablet and contact dock on mobile.
- Show one green WhatsApp consultation action in the desktop catalogue header without adding WhatsApp actions to model cards.
- Prefill a visitor-editable qualification draft with source page and available UTM campaign context.
- Emit an implementation-neutral browser event for future approved analytics wiring.
- Explain the external WhatsApp handoff in the public privacy notice.

## Acceptance Criteria

- [x] A desktop visitor sees one WhatsApp action in the hero and a visible tap-to-call number in the header.
- [x] A narrow-mobile visitor sees one persistent WhatsApp action and one call action; the hero WhatsApp action is not duplicated.
- [x] A desktop catalogue visitor sees one green WhatsApp action in the header and no repeated WhatsApp actions on model cards.
- [x] Opening WhatsApp includes qualification prompts, the current page URL, and an available campaign identifier.
- [x] The site never claims that the WhatsApp message was sent automatically.
- [x] Contact actions remain keyboard accessible and at least 44 pixels high on mobile.
- [x] No analytics request or personal-data storage is introduced without a separately approved destination and policy update.

## PRD Alignment

- Related requirements: PRD Sections 8 and 10 only as a boundary reference.
- Relationship: extension to the separate public commercial website. It does not add automatic WhatsApp delivery to the field-service MVP and does not alter the service-call workflow.

## Competitor Inspiration

- [Square](https://mobbin.com/sites/sections/d177e538-7fcc-423a-af99-c9a142303422) — adapts the single visually distinct contact action placed at the outer edge of global navigation.
- [Intercom](https://mobbin.com/sites/sections/650d948a-d6fe-47dc-8332-f3639148b176) — reinforces keeping the sales-contact action persistent and separate from catalogue content.
- [Ada](https://mobbin.com/sites/sections/7ab58ecd-a823-4995-8ef4-f7e9bc06a48f) — supports a concise expert-help action integrated into the desktop header.

## Out of Scope

- Automatic sending of a WhatsApp message.
- A lead form, CRM, WhatsApp Business API, advertising pixel, analytics vendor, or server-side conversion endpoint.
- Repeating WhatsApp buttons on every homepage section, category, or model card.
- Field-service status notifications over WhatsApp.

## Open Questions

- Which approved analytics or CRM destination should receive `lead_intent_opened` events in a later release?
- Who owns response-time monitoring and lead-status updates after a WhatsApp conversation starts?
