# LiftVoltraq Product Landing Page Source of Truth

These instructions apply to all work under `landing-site/`.

## Purpose and boundary

- `landing-site/` is the public Hebrew product page for LiftVoltraq, the field-service management system defined in `docs/PRDs/PRD.md`.
- The page explains the complete confirmed MVP: customer request, service-desk handling, technician assignment and field work, parts used, customer signature, call closure, service report, and operational history.
- LiftVoltraq is the product. Lift Pro 26 Israel Ltd. may appear only as a customer or demo tenant and must remain visually subordinate.
- The supplied equipment-catalogue PDFs under `catalogue/` are retained source material for a possible separate equipment-catalogue project. They are not the product source of truth for this landing page and must not drive its routes or claims unless Michael explicitly reopens that scope.
- This remains a static HTML, CSS, and JavaScript implementation. Do not add a framework, backend, CMS, database, authentication system, analytics, or deployment architecture by assumption.
- Follow the repository-local `premium-landing-pages` skill for landing-page design and implementation work.

## Product source hierarchy

Use these sources in order:

1. The Apple Pages specification under `../docs/PRDs/`.
2. `../docs/PRDs/PRD.md` for structured requirements and requirement IDs.
3. `../docs/clientSystemAnaluse_1.html` for client-facing Hebrew wording and tone.
4. `../design/design.md` for the approved dark-industrial LiftVoltraq visual system.
5. `../docs/mock/PLAN.md` and `../mock/` for the implemented fictional demo flow.

If the sources conflict, report the discrepancy. Never resolve an open product question by inventing functionality or commercial wording.

## Confirmed MVP coverage

The landing page may present these confirmed areas:

- customer login/personal area, equipment list, new call, photos, active calls, history, and reports (`FR-1.1`–`FR-1.8`);
- service-desk queue, review, urgency, technician assignment, scheduling, internal notes, and in-system closure notification (`FR-2.1`–`FR-2.7`);
- assigned calls, customer/site/equipment/fault context, status changes, treatment summary, completion photos, parts, signature, and closure (`FR-3.1`–`FR-3.10`);
- customers, contacts, sites, equipment records, and service history (`FR-4.1`–`FR-4.6`);
- basic parts catalogue, name/SKU search, and parts-used records (`FR-5.1`–`FR-5.4`);
- the complete status lifecycle, structured service report, call history/audit events, and in-system notifications;
- initial setup inputs for customers, contacts, sites, equipment, technicians, fault types, parts, and report wording;
- the intended PWA delivery model when the application is implemented.

The page must explain the full product coherently rather than presenting a disconnected set of feature claims.

## Scope that must not be advertised as MVP

Do not present these as current MVP functionality:

- complete warehouse inventory, purchasing, or parts ordering;
- invoices, accounting, ERP, or Ituran integrations;
- automatic WhatsApp or SMS sending;
- full offline operation;
- complete preventive-maintenance scheduling;
- store-published native apps;
- video attachments as a core service-call feature;
- QR equipment call opening or other future-phase items.

The following remain open or candidate requirements and may be mentioned only as unresolved: structured fault categories, an exact equipment-category taxonomy, technician identity as a formal report field, in-app navigation, customer documents, and customer settings.

## Audience and conversion goal

- The audience is an equipment-service company evaluating LiftVoltraq for its customers, service desk, technicians, managers, and parts staff.
- The page should make the end-to-end service workflow understandable and lead the visitor to the existing interactive demo under `../mock/`.
- The primary action is to open the interactive demo. The structured Hebrew specification is a secondary information action.
- Contact method, form handling, phone number, WhatsApp destination, price, availability, implementation timeline, warranties, customer counts, performance metrics, and other commercial claims remain undecided. Do not invent them.
- Clearly identify fictional demo data and do not imply that the static demo stores or transmits real customer data.

## Page structure

Keep this complete conversion flow unless the PRD changes:

1. Assembly hero — an industrial metaphor for the product’s connected workflow.
2. End-to-end service-call workflow.
3. Five product roles and their distinct responsibilities.
4. Technician field-work experience and the next-call hierarchy.
5. Structured service report and audit history.
6. Explicit MVP inclusions, exclusions, and unresolved product decisions.
7. Final action into the interactive multi-role demo.

Each major section must have one clear message. Remove repeated marketing copy or claims that are not traceable to the PRD.

## Approved assembly hero

- The opening assembly hero is a Michael-approved exception to the landing-page skill's ban on scroll-controlled video and pinned storytelling.
- It may use one sticky viewport segment while native page scroll deterministically scrubs the supplied assembly video down and back up.
- Never intercept wheel, touch, keyboard, browser-find, anchor, or scrollbar input.
- Never autoplay or loop the video.
- Stop changing frames whenever scrolling stops.
- Under `prefers-reduced-motion: reduce`, replace the scrubbed video with the complete static frame and show all essential copy without scroll-dependent reveals.
- The machine image is a visual metaphor, not a named catalogue model. Do not derive technical claims from it.

## Language and visual direction

- Keep `lang="he"` and `dir="rtl"` at document level.
- Write concise, natural professional Hebrew.
- Keep model names, call numbers, times, units, `PWA`, and other LTR runs directionally stable.
- Use the dark-industrial LiftVoltraq design tokens from `../design/design.md`: near-black and charcoal surfaces, off-white text, and lime green as the only interaction accent.
- Build mobile-first and preserve logical DOM order across breakpoints.
- Use large editorial typography, generous whitespace, deliberate alignment, and actual product/workflow content rather than decorative card grids.
- Use the canonical logo directly from `../assets/brand/`; do not copy, redraw, recolor, or regenerate it.

## Motion and section backgrounds

- Preserve native scrolling everywhere outside the approved hero scrub.
- Assign every major section an accessible charcoal-family palette and transition the global content shell as the active section crosses a center-biased activation zone.
- Make activation deterministic in both directions; reverse scrolling must restore previous colors.
- Keep section background and foreground transitions in the `500–800ms` range.
- Reveal meaningful content groups once using opacity and a `16px` vertical offset over `400–600ms`.
- Do not replay entrance reveals on reverse scroll.
- Do not add another sticky storytelling section, parallax, animated background, continuous decorative motion, or heavy animation library.
- Respect changes to `prefers-reduced-motion` and keep all content visible if JavaScript is unavailable.

## Accessibility and trust

- Use semantic landmarks, correctly ordered headings, native links, and descriptive Hebrew control names.
- Keep a visible-on-focus skip link and a visible `:focus-visible` treatment against every active palette.
- Maintain at least 44px touch targets.
- Meet WCAG AA contrast for text and essential UI boundaries.
- Do not rely on color alone for urgency, status, inclusion, or exclusion.
- Keep the hidden hero-resolution action inert until its message is visibly active.
- Avoid horizontal overflow at all supported widths.
- Preserve usable copy, navigation, and demo links when animation or JavaScript is disabled.

## Current local implementation

- Entry document: `index.html`.
- Styles and palettes: `styles.css`.
- Hero scrub, section activation, and one-time reveals: `hero.js`.
- Structured content traceability: `data/site-content.json`.
- Assembly media: `assets/assembly/`.
- Primary destination: `../mock/`.

The implementation has no package manager, build step, linter, or automated test suite.

## Verification gates

Before calling the page complete:

1. Reconcile all visible product claims against the PRD and its explicit MVP exclusions.
2. Confirm the assembly hero scrubs from start to finish and back to the start without intercepting native input.
3. Scroll down and back up through every marketing section and confirm the correct palette activates in both directions.
4. Confirm entrance reveals run once and do not replay on reverse scroll.
5. Test representative desktop and narrow mobile viewports for wrapping, touch targets, RTL behavior, and horizontal overflow.
6. Test reduced-motion behavior: static complete hero frame, visible content, no reveal motion, and functioning palette updates.
7. Verify keyboard focus treatment on all relevant links and actions.
8. Confirm the interactive demo and Hebrew specification links resolve locally.
9. Confirm the browser console has no warnings or errors.
10. Run `node --check landing-site/hero.js`, parse `landing-site/data/site-content.json`, and run `git diff --check`.

Report the section/color flow, PRD coverage, changed files, browser checks, and any unverified behavior or unresolved business decision.
