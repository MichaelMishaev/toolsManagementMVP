# Lift Pro 26 Israel Commercial Landing Page

These instructions apply to all work under `landing-site/`.

## Purpose and product boundary

- `landing-site/` is the public Hebrew commercial website for **Lift Pro 26 Israel Ltd.**
- The company imports and markets forklifts, construction machinery, industrial equipment, heavy equipment, and spare parts for the Israeli market.
- The landing page is not a marketing page for the field-service application under `../mock/`, even though both now use the Lift Pro 26 identity.
- The service-management application and its PRD remain separate repository artifacts and must not drive this landing page's messaging, navigation, or conversion actions.
- Keep the landing implementation static HTML, CSS, and JavaScript unless Michael explicitly approves a different stack.
- Follow the repository-local `premium-landing-pages` skill for landing-page design and implementation work.

## Commercial source hierarchy

Use these sources in order:

1. Company documents explicitly supplied by Michael, including the Lift Pro 26 Israel about document.
2. Approved company catalogues under `catalogue/` for model-level and technical content.
3. `data/site-content.json` for structured page traceability.
4. `competitors.md` only for market and interaction reference, never as a source for company claims.

Do not use the application PRD or demo as commercial truth for this page. If company documents and catalogue specifications conflict, report the discrepancy.

## Confirmed positioning

- Brand: `Lift Pro 26 Israel`.
- Core line: `ציוד גדול. חשיבה חדשה. מחיר שעובד בשביל העסק שלך.`
- Audience: warehouse owners, small and medium contractors, infrastructure companies, quarries, ports, logistics operations, and other Israeli businesses that need working equipment.
- Product range: electric and diesel forklifts, telescopic handlers, excavators, loaders, quarry and port equipment, logistics equipment, and heavy tools for infrastructure projects.
- Value mechanism: direct international sourcing, fewer intermediary layers, lean operating structure, competitive pricing, local warranty/service, and spare-parts sourcing.
- Named international relationships in the supplied company document: `LOVOL` and `NICOSAIL`.
- Named Israeli working relationship in the supplied company document: Olnik Group, presented as a relationship intended to learn field needs and develop suitable solutions.

## Claims and trust boundaries

- Do not invent model specifications, prices, stock availability, delivery times, financing terms, warranties, certifications, customer counts, testimonials, or contact details.
- The document states that spare-parts costs may in many cases be approximately 35%-40% lower than customary official-importer pricing. Always retain the qualification that the result depends on the part, model, and supply source.
- Do not imply exclusive distribution rights unless a supplied agreement explicitly proves exclusivity.
- Do not describe the assembly-animation machine as a named catalogue model or derive technical specifications from it.
- Company registration details found on third-party websites are not approved marketing copy unless Michael explicitly adds them to the source set.

## Catalogue experience

- Raw PDF files are source/download artifacts, not the primary customer experience.
- Catalogue models and specifications must be presented as designed semantic HTML pages or components that customers can browse without downloading a PDF.
- Each designed catalogue entry may include a clearly labeled PDF download link to its source file.
- Preserve exact model names, units, tables, warnings, and technical qualifications from the source PDF.
- Do not expose a bare directory listing or build the catalogue as PDF thumbnails alone.

## Page structure

Keep this commercial flow unless later source material changes it:

1. Assembly hero - direct-import equipment becoming ready for work.
2. Equipment categories and customer use cases.
3. Direct-import and ownership value proposition.
4. International manufacturers and Israeli field relationships.
5. Warranty, service, maintenance, and spare-parts value.
6. Company origin story and long-term vision.
7. Clear movement toward equipment selection or an approved contact channel.

## Language, identity, and motion

- Keep `lang="he"` and `dir="rtl"` at document level and use natural professional Hebrew.
- Use the canonical badge/logo directly from `../assets/brand/`; do not create or copy alternative logos.
- Preserve the approved black industrial visual language: near-black and charcoal fields, off-white text, and lime as the primary interaction accent.
- The assembly hero is an approved exception: native scrolling may scrub one sticky video in both directions. Never intercept input, autoplay continuously, or keep changing frames after scrolling stops.
- Serve responsive video assets, preserve the mobile loading unlock, and keep the complete static frame for reduced motion and media failure.
- Major content sections may transition among accessible dark industrial background tones over 500-800ms.
- Entrance reveals must run once, remain subtle, and be disabled under `prefers-reduced-motion`.

## Accessibility and verification

- Use semantic landmarks, ordered headings, native links, visible focus states, and at least 44px touch targets.
- Meet WCAG AA contrast and preserve logical DOM order across breakpoints.
- Avoid horizontal overflow and keep essential content usable without JavaScript.
- Before completion, verify desktop, narrow mobile, reverse scrolling, reduced motion, keyboard navigation, media loading, console output, and all approved destinations.
- Run `node --check landing-site/hero.js`, parse `landing-site/data/site-content.json`, run the Impeccable detector once, and run `git diff --check`.
