# AGENTS.md

This file provides repository-specific guidance to Codex and other coding agents.

## Repository purpose

This repository currently contains the MVP specification for a field-service management platform used by an Israeli company that services forklifts, aerial/scissor lift platforms, and other mechanical equipment. Do not reinterpret the product as an elevator-service system.

The core workflow runs from a customer fault report through service-desk triage, technician assignment and field work, customer signature, call closure, and generation of a service report.

This is presently a documentation/static-site repository, not the application implementation. Do not invent a framework, backend, database, authentication model, or architecture unless Michael explicitly asks to begin implementation.

## Sources of truth

Use these sources in this order:

1. The Apple Pages document under `docs/PRDs/` is the original client specification and highest product source of truth. It is a binary iWork bundle and may require Pages export before its contents can be inspected.
2. `docs/PRDs/PRD.md` is the structured English PRD derived from that source. Read it before making product-scope or requirement decisions.
3. `docs/clientSystemAnaluse_1.html` is the Hebrew, client-facing presentation of the specification.

If the derived PRD and HTML conflict with the original source, report the discrepancy instead of silently choosing or expanding scope. Items under "Candidate requirements" or "Open Questions" in the PRD are unresolved and are not committed MVP functionality.

`CLAUDE.md` contains companion repository guidance for Claude Code. Keep shared repository facts consistent between that file and this one when those facts materially change.

## Brand assets

`assets/brand/README.md` is the brand-asset source of truth. The current identity is Lift Pro 26 / `ליפט פרו 26 ישראל בע״מ`.

- `assets/brand/lift-pro-26-logo-transparent.png` is the approved canonical artwork for product, legal, report, and customer-facing surfaces.
- Preserve the logo's transparent canvas and aspect ratio; do not crop it into a dark rectangle or add a backdrop.
- The former client screenshot and historical `liftvoltraq-*` assets were superseded and removed from the working tree. Do not reintroduce them into new work.

## Technician design references

`design/design.md` documents three unapproved technician-mobile design directions. It is a design handoff and implementation guide, not a product source of truth; the original Pages specification, `docs/PRDs/PRD.md`, and `docs/clientSystemAnaluse_1.html` remain authoritative in that order.

The corresponding raster references live in `design/temp/`:

- `01-next-job-command.png` — action-first next-call home;
- `02-route-timeline.png` — ordered daily schedule/timeline;
- `03-compact-service-queue.png` — dense assigned-call queue.

Do not silently select a direction or promote an exploratory affordance into MVP scope. In particular, map/GPS navigation is candidate requirement CR-4, route visualisation must not imply route optimization, and the queue's filtering/"next call" rules require a product decision. When updating a direction, preserve Hebrew-first RTL, mobile-first behavior, the shared design language, and the requirement/scope notes in `design/design.md`.

## Current MVP boundaries

The MVP includes customer, service-desk, technician, service-manager, and basic warehouse/parts roles; customer and equipment records; service-call handling; technician documentation; parts used; customer signature; service reports; history/audit events; and in-system notifications.

The MVP explicitly excludes full inventory and purchasing, accounting/invoicing integration, ERP or Ituran integration, automatic WhatsApp/SMS delivery, full offline support, preventive-maintenance scheduling, core video attachments, and store-published native apps. It is intended to operate as a PWA when an application is implemented.

Do not promote future-phase ideas or discovery candidates into the MVP without an explicit product decision.

## Static specification page

`docs/clientSystemAnaluse_1.html` is a single self-contained HTML document with inline CSS and JavaScript. It has no build system, package manager, or external dependency graph.

The page is Hebrew-first and must remain `lang="he"` and `dir="rtl"`. Keep client-facing content in natural Hebrew and preserve the existing tone.

Its main interactive behavior includes:

- sticky navigation and section scroll-spy;
- reading-progress indicator;
- accessible persona tabs;
- service-status lifecycle simulator;
- print handling that expands collapsed modules before printing.

When editing persona tabs, keep tab IDs, `aria-controls`, panels, and keyboard behavior synchronized. When editing service statuses, update both the visible controls and the `statusData` mapping. Reuse the CSS custom properties in `:root` rather than introducing arbitrary colors or spacing values.

## Working rules

- Read `docs/PRDs/PRD.md` and the relevant HTML section before changing requirements or client-facing content.
- Inspect `git status` before editing. Preserve existing uncommitted work and do not undo file moves or unrelated changes.
- Treat the deployed GitHub Pages site and the local working tree as separate states; verify both before claiming that a change is live.
- Keep changes narrowly scoped. Do not add tooling, dependencies, architecture documents, or implementation scaffolding unless requested.
- Use stable requirement IDs from the PRD when discussing or changing functional scope.
- Preserve traceability: clearly label confirmed MVP requirements, explicitly deferred items, candidate requirements, and unresolved questions.
- Never resolve an open product question by assumption when it would change scope, permissions, workflow, or customer commitments.
- For technician design work, inspect `design/design.md`, the relevant reference mock under `design/temp/`, and the supporting PRD requirements before changing the design guidance or translating it into Figma/code.

## Preview and verification

There is no build, lint, or automated test command currently configured.

For local preview, serve the repository and open the HTML document:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000/docs/clientSystemAnaluse_1.html`.

For content-only changes, verify the relevant PRD/HTML sections and check the diff. For UI or interaction changes, also inspect the rendered page in a real browser at the affected viewport, exercise the changed interaction, and verify Hebrew RTL layout and keyboard/accessibility behavior where relevant.
