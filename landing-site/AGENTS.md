# Landing Site Source of Truth

These instructions apply to all work under `landing-site/`. They capture the decisions made for the public marketing website and catalogue.

## Purpose and Boundary

- `landing-site/` is the dedicated home for the public-facing equipment website. Keep it separate from `docs/`, which contains the field-service product specification and client presentation.
- The site is for an Israeli company selling or presenting heavy mechanical equipment, including excavators, loaders, electric loaders, and spare parts. Do not reinterpret it as an elevator-service website.
- The website must help a prospective customer understand the available equipment, compare relevant specifications, and make an enquiry.
- The public website and catalogue are not the field-service management application described in `docs/PRDs/PRD.md`. Do not mix their routes, roles, workflows, or requirements unless explicitly requested.
- This repository does not yet define a landing-site framework or architecture. Before implementation, inspect the current repository and use the smallest suitable approach. Do not add a framework, backend, CMS, database, authentication system, or deployment architecture by assumption.
- Follow the repository-local `premium-landing-pages` skill for all landing-page design and implementation work.
- The opening assembly hero is an explicit, Michael-approved exception to that skill's ban on scroll-controlled video and pinned storytelling. It may use one sticky viewport segment while native page scroll deterministically scrubs the supplied assembly video down and back up. Never intercept wheel, touch, keyboard, or scrollbar input; never autoplay or loop the video; stop changing frames whenever scroll stops; and replace the interaction with the complete static frame under `prefers-reduced-motion: reduce`.

## Current Inputs

- `catalogue/` contains the original manufacturer and supplier PDFs. They are authoritative source material for product images, model names, part numbers, measurements, units, and technical specifications.
- `competitors.md` contains the approved market-reference list.
- Current competitor references are:
  - `https://ge-sany.co.il/`
  - `https://www.feldman.co.il/`
  - `https://comasco.co.il/`
  - `https://vce.co.il/`
  - `https://www.czapnik.co.il/`
- Use `https://msx.co.il/` only as inspiration for the global section-background transition behavior described below.
- Competitor sites are research references only. Do not copy their wording, brand identity, page composition, code, imagery, or catalogue content. Confirm usage rights before reusing any third-party asset.
- `../assets/brand/` is the only canonical logo directory. Reference its files directly; do not create optimized, copied, or renamed logo assets inside `landing-site/`, `design/`, `mock/`, or other folders.

## Product and Conversion Goal

- Present the company as a credible, professional equipment supplier with a clear, modern catalogue.
- Make equipment discovery faster and easier than a large dropdown menu or a folder of brochures.
- Use one primary conversion action throughout the experience, normally a product-specific enquiry or request for a quote. The exact contact method, destination, phone number, WhatsApp number, form handling, and commercial wording remain undecided until Michael confirms them.
- Never invent prices, availability, delivery times, warranties, certifications, years of experience, customer counts, service coverage, exclusive-distributor status, testimonials, or other business claims.
- Keep secondary actions subordinate. Downloading a catalogue is secondary to understanding a product and making an enquiry.

## Recommended Information Architecture

Use this as the current direction, adapting only when the extracted catalogue proves that another grouping is needed:

- `/` - marketing homepage;
- `/catalogue` - designed HTML catalogue index with categories, search, and useful filters;
- `/catalogue/excavators` - excavator category;
- `/catalogue/wheel-loaders` - wheel-loader category;
- `/catalogue/electric-wheel-loaders` - electric-loader category;
- `/catalogue/spare-parts` - searchable parts catalogue;
- `/catalogue/{category}/{model}` - individual HTML product page;
- `/service-and-parts` - service, maintenance, and parts proposition when verified content exists;
- `/contact` - concise enquiry path.

Do not create empty routes merely to match this list. Add other categories only after identifying real products in the supplied source material.

## Homepage Structure

Prefer a concise conversion flow:

1. Hero - a clear Hebrew value proposition, one strong equipment image, and the primary CTA.
2. Equipment categories - direct visual entry to the catalogue.
3. Featured models - a small, deliberate selection rather than an indiscriminate grid.
4. Trust or company proof - only verified facts, brands, certifications, service capabilities, or other evidence.
5. Service and spare parts - explain the local support proposition when confirmed.
6. Objection handling - answer the few questions that block an enquiry.
7. Final CTA/contact - restate the value and provide one obvious next action.

Give each section one message and one conversion purpose. Remove sections that repeat another section without adding evidence or clarity.

## HTML Catalogue Is the Product Experience

- Treat every PDF in `catalogue/` as input material, not as the customer-facing catalogue.
- Customers must be able to browse and understand the catalogue as designed, responsive HTML without opening or downloading a PDF.
- Build real HTML category pages, product cards, individual product pages, specification tables, search, and filters.
- Do not embed a PDF viewer or reproduce the brochure page-by-page in the browser.
- A PDF download must never be the only way to see product information.

### Category Pages

- Show a clear category introduction and a scannable product grid or list.
- Each product card should use a real product image and show the model, product type, a few decision-useful specifications, and a clear link to the product page.
- Add filters only when the source data supports accurate, useful comparison. Examples may include operating weight, power, bucket capacity, equipment type, compatible brand, or part category.
- Search and filter results must remain usable with keyboard and touch input and must expose a helpful empty state.

### Product Pages

Include, when the source provides the information:

- product name and exact model identifier;
- category and breadcrumb navigation;
- optimized image gallery;
- short natural-Hebrew explanation of what the machine is for;
- four or five important specifications near the top;
- complete semantic HTML specification tables grouped by topic;
- suitable applications, compatible equipment, or attachments when verified;
- product-specific enquiry or quote action;
- related products when the relationship is supported by the catalogue;
- an optional `Download original catalogue (PDF)` action near the lower-detail area.

### Spare-Parts Catalogue

- Convert large parts PDFs into searchable or filterable HTML product listings.
- Show a product image, exact part number, part name or type, compatible brand/model information, and an enquiry action when available.
- Do not expose hundreds of parts as screenshots of brochure pages.
- Do not infer compatibility from appearance alone. Ambiguous compatibility must be flagged for review.

## Prohibited PDF Presentation

Do not:

- embed a PDF viewer as the main catalogue experience;
- display a raw PDF in an iframe;
- require a download before customers can view specifications;
- use screenshots of complete PDF pages as category or product pages;
- automatically convert the printed PDF layout into unstructured or inaccessible HTML;
- expose a directory-style list of PDF filenames as the public catalogue;
- load entire PDFs during ordinary HTML browsing;
- represent a PDF page image as selectable or searchable product information.

## PDF Extraction and Content Accuracy

- Extract and normalize the useful content; do not reproduce the print layout literally.
- Preserve model names, measurements, units, part numbers, engine identifiers, capacities, and technical values exactly as supplied.
- Never guess a missing value or silently correct suspicious source data.
- Flag unreadable, contradictory, duplicated, or uncertain content before publishing it as fact.
- Where multiple PDFs describe the same model, reconcile them explicitly and record the chosen source rather than silently merging conflicting values.
- Translate or rewrite customer-facing prose into natural Hebrew while preserving technical meaning. Do not translate model identifiers, part numbers, or units.
- Keep a traceable source association for every HTML product and part record, including its source PDF and relevant page or spread where practical.
- Use structured catalogue data as the rendering source instead of hardcoding repeated specifications independently across cards and detail pages.
- Changes to structured data must update every consuming view consistently.

## Images and Assets

- Reuse legitimate product photography from the supplied PDFs when its resolution, crop, and usage rights are suitable.
- Extract product imagery as standalone optimized web assets; do not ship full brochure pages as images.
- Preserve aspect ratio and avoid stretching, low-resolution enlargement, careless background removal, or crops that hide important machine details.
- Use responsive image sizes, explicit width and height, and lazy loading below the fold.
- Write useful Hebrew alt text for informative images. Use empty alt text for purely decorative duplicates.
- When suitable source imagery is unavailable, obtain or generate a real visual asset through the approved design workflow. Do not use placeholder boxes, emoji, CSS drawings, or fake equipment silhouettes.

## Original PDF Downloads

- Preserve original PDF files without destructive modification.
- Provide an original PDF only as an optional secondary download from the related category or product context.
- Use a clear customer-facing label such as `הורדת הקטלוג המקורי (PDF)` rather than exposing an unclear source filename.
- Show that the file is a PDF and show file size when useful, especially for large downloads.
- Make sure each download points to the correct original file and does not silently replace it with a lower-quality export.
- Use stable public URLs or mappings even when source filenames contain spaces, Chinese characters, or other non-Latin text.
- Do not rename or reorganize source PDFs destructively without preserving a traceable mapping from the original file.

## Language and Layout

- The public site is Hebrew-first and RTL. Use `lang="he"` and `dir="rtl"` at the document level unless a deliberately localized route requires otherwise.
- Write natural, professional Hebrew rather than literal machine translation.
- Keep recognized technical terms, Latin model names, numbers, and units directionally stable inside RTL content.
- Build mobile-first, then increase whitespace and composition sophistication on larger screens.
- Preserve logical DOM and reading order when visual positioning changes across breakpoints.

## Visual Direction

- Use a clean, premium industrial design rather than a generic template.
- Prefer large editorial typography, strong hierarchy, generous whitespace, deliberate alignment, and a minimal confident composition.
- Use large real machinery photography as the primary visual language.
- Use the dark-industrial LiftVoltraq system in `../design/design.md`: near-black and charcoal surfaces, off-white text, and lime green as the only interaction accent. Keep sections within the charcoal family and do not introduce a separate marketing palette.
- Make categories and key product facts easier to scan than on the competitor references.
- Avoid enormous navigation trees. Use clear top-level navigation, visual categories, search, and contextual filtering.
- Make the primary enquiry CTA visibly dominant while keeping PDF downloads and secondary navigation quiet.

## Global Section Background Behavior

- Use native browser scrolling.
- Assign every major marketing section an explicit accessible color set: background, primary text, muted text, border, button, button text, icon, and focus ring.
- As a section crosses a stable center-biased viewport activation zone, transition the global page background to that section's assigned background.
- The behavior must be deterministic in both directions. Scrolling back up restores every previous section palette.
- Prefer `IntersectionObserver` and choose the section closest to the activation line; do not depend on observer callback order when multiple sections intersect.
- Apply active colors through global design tokens on the page shell or document root.
- Transition background and foreground colors over `500-800ms` with subtle `ease-in-out` easing.
- Update text, links, borders, buttons, icons, and focus states along with the background so contrast remains accessible.
- Set the first section's palette in initial HTML/CSS to avoid a flash during startup.

## Entrance Motion

- Add subtle entrance animation only when a meaningful content group first enters the viewport.
- Animate from `opacity: 0` and `translateY(16px)` to full opacity and `translateY(0)`.
- Use a `400-600ms` duration with subtle easing.
- Stagger related cards or list items by `60-100ms`.
- Animate once and unobserve the element; do not replay entrances while scrolling back and forth.
- Keep content visible by default. Apply pre-animation hiding only after JavaScript confirms that motion is enabled.
- Do not animate every small label, icon, or paragraph separately.

## Reduced Motion

- Respect `prefers-reduced-motion: reduce` in CSS and JavaScript.
- Show all content immediately with no reveal opacity or transform.
- Remove or effectively eliminate global color-transition animation while continuing to update the active palette correctly.
- Do not initialize entrance observers when reduced motion is enabled.
- Handle motion-preference changes during the session when practical.

## Prohibited Motion and Interaction

Do not use:

- scroll hijacking, wheel interception, or artificial smooth-scroll systems;
- canvas, WebGL, or image-sequence animations;
- animated background imagery;
- excessive parallax;
- continuous or looping decorative motion;
- heavy animation libraries when CSS and `IntersectionObserver` are sufficient.

Normal sticky navigation is acceptable when it aids wayfinding and does not pin narrative content.

The approved opening assembly hero is the sole exception for one native-scroll sticky segment and one scroll-scrubbed video. No other section may inherit that behavior without a new explicit decision.

## Accessibility and Performance

- Use semantic landmarks, correctly ordered headings, native controls, and descriptive link/button names.
- Keep every navigation, filter, form, gallery control, enquiry action, and download keyboard-operable.
- Provide visible `:focus-visible` states against every active section background.
- Meet WCAG AA contrast: at least `4.5:1` for normal text and `3:1` for large text and essential UI boundaries.
- Recheck hover, active, selected, disabled, and focus states for every palette.
- Avoid horizontal overflow and maintain comfortable touch targets on narrow screens.
- Avoid layout shifts, oversized assets, duplicate observers, unnecessary client JavaScript, and loading full-resolution media before it is needed.
- Preserve catalogue content and enquiry paths when animation is disabled or JavaScript fails.
- Use native scrolling, anchor navigation, browser find, keyboard scrolling, and scrollbar interaction without interference.

## Implementation Workflow

Before building:

1. Read this file and the repository-level instructions.
2. Inspect `git status` and preserve unrelated work.
3. Inspect the current stack, design tokens, brand assets, catalogue files, and existing conventions.
4. Inventory the PDFs and create a proposed category/model map with traceable sources.
5. Define the target customer, confirmed offer, and primary conversion action; keep missing commercial details open.
6. Propose the homepage sections and a concise section-color flow before implementation.
7. Implement the smallest coherent HTML catalogue slice using real source data rather than scaffolding an unsupported architecture.

## Verification Gates

Do not call landing-site or catalogue work complete until all applicable checks pass:

1. Confirm every published product can be understood without opening its PDF.
2. Compare model names, part numbers, units, specifications, images, and claims against their source PDFs.
3. Confirm every optional PDF action downloads or opens the correct original file.
4. Confirm no public route exposes only a PDF viewer, brochure-page screenshots, or a raw PDF filename list.
5. Test the homepage, a representative category page, a representative product page, and the parts experience when implemented.
6. Test at least one representative desktop viewport and one narrow mobile viewport for wrapping, cropping, touch targets, RTL behavior, and horizontal overflow.
7. Scroll down and back up through all major marketing sections and confirm background and foreground palettes activate in the correct order both ways.
8. Confirm entrance animations play once only.
9. Enable reduced motion and confirm all content is immediately visible, palette changes still work, and no reveal motion plays.
10. Navigate every relevant interaction by keyboard and confirm visible focus against each active background.
11. Verify native wheel, touch, keyboard, scrollbar, anchor-link, and browser-find behavior.
12. Run the smallest relevant lint, type, test, build, and real-browser checks provided by the selected implementation stack.

Report the implemented information architecture, section/color flow, structured catalogue coverage, changed files, browser checks, and any unverified catalogue content or missing business decisions.
