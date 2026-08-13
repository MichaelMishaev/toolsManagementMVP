# Lift Pro 26 landing-page design

## Direction

The landing page is a Hebrew-first, RTL commercial site for Lift Pro 26 Israel,
an importer and marketer of forklifts, earthmoving machinery, and heavy
equipment. It must never read like a software-product landing page.

The visual world is industrial and restrained: near-black surfaces, dust-white
type, steel-grey rules, and a focused lime accent. Large editorial headlines,
wide spacing, and specification-like rows make the equipment feel substantial
without relying on decorative effects.

## Narrative

1. The scroll-scrub hero assembles a machine as the visitor scrolls naturally.
2. The page explains the direct-import and ownership proposition.
3. Equipment categories clarify the range of work covered.
4. Manufacturer and Israeli field relationships establish context.
5. Service and spare-parts content addresses long-term ownership.
6. The company story explains why Lift Pro 26 exists.
7. A four-point equipment brief helps the visitor prepare for model selection.

Until approved commercial contact details exist, calls to action lead to the
equipment range and selection brief. They must not imply that a message, quote
request, or form submission has been sent.

## Motion

- Use native page scrolling.
- The hero video time follows scroll position in both directions; it does not
  autoplay as a conventional movie.
- Major-section background colors transition over 500–800ms.
- Content reveals once with a short fade and 16px upward movement.
- `prefers-reduced-motion` shows stable content without scrub or reveal motion.

## Content constraints

- Follow `../assets/brand/README.md` for logo provenance.
- The landing uses the approved transparent `lift-pro-26-logo-transparent.png` as its canonical logo.
- CSS preserves the complete artwork and native aspect ratio without a crop or dark backdrop.
- Commercial facts must come from approved Lift Pro 26 company material.
- Do not invent prices, finance, stock, delivery, warranty, certification, or
  contact details.
- The spare-parts percentage must remain qualified by part, model, and source.
- Catalogue PDFs are optional downloads; customer-facing catalogue pages must
  be designed semantic HTML rather than raw PDF embeds.

## Responsive and accessibility rules

- Mobile is the primary reading order; desktop expands the same hierarchy.
- Maintain RTL alignment and logical DOM order.
- Keep visible keyboard focus, semantic headings, and WCAG-compliant contrast.
- Avoid horizontal overflow and keep persistent mobile actions clear of content.
