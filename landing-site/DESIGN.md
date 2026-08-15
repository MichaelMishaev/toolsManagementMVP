---
name: "Lift Pro 26 Israel Commercial Site"
description: "A bright Hebrew RTL product world that makes verified heavy equipment understandable before it feels heavy."
colors:
  page: "#f5f5f7"
  surface-glass: "rgba(255, 255, 255, 0.82)"
  surface-soft: "#ececf0"
  ink: "#1d1d1f"
  ink-muted: "#5d5d62"
  ink-subtle: "#86868b"
  action-blue: "#0071e3"
  action-blue-hover: "#0077ed"
  action-blue-bright: "#2997ff"
  action-blue-deep: "#0066cc"
  lift-lime: "#a4c944"
  lift-lime-light: "#c9e879"
  lift-lime-ink: "#172208"
  dark-field: "#101012"
  border-soft: "rgba(29, 29, 31, 0.09)"
  white: "#ffffff"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(4rem, 8vw, 6rem)"
    fontWeight: 730
    lineHeight: 0.93
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(2.45rem, 5.4vw, 5rem)"
    fontWeight: 710
    lineHeight: 0.98
    letterSpacing: "-0.045em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(1.35rem, 2.5vw, 2rem)"
    fontWeight: 690
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  lead:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 680
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  compact: "0.7rem"
  card: "1rem"
  detail: "1.2rem"
  glass: "1.45rem"
  field: "2rem"
  spatial: "clamp(2rem, 4vw, 3.5rem)"
  circle: "50%"
  pill: "999px"
spacing:
  detail: "0.35rem"
  tight: "0.7rem"
  base: "1rem"
  control-x: "1.25rem"
  cluster: "1.8rem"
  section-gap: "2.5rem"
  gutter: "clamp(1rem, 4vw, 4rem)"
  section-y: "clamp(4.5rem, 9vw, 8.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.white}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0.72rem 1.25rem"
    height: "3.05rem"
  button-primary-hover:
    backgroundColor: "{colors.action-blue-hover}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
  button-secondary:
    backgroundColor: "rgba(255, 255, 255, 0.48)"
    textColor: "{colors.action-blue}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0.72rem 1.25rem"
    height: "3.05rem"
  navigation-shell:
    backgroundColor: "rgba(255, 255, 255, 0.68)"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.5rem 0.35rem 0.85rem"
    height: "3.85rem"
  equipment-card:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "clamp(1.5rem, 3vw, 2.5rem)"
    height: "14rem"
  verified-detail:
    backgroundColor: "rgba(255, 255, 255, 0.55)"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.6rem 1.1rem"
---

# Design System: Lift Pro 26 Israel Commercial Site

## Overview

**Creative North Star: "The Clear Equipment Field"**

Verified equipment should feel understandable before it feels heavy. The world uses bright spatial fields, precise system typography, one complete machine as the hero object, and calm physical depth to help Israeli operators move from the offer to the right equipment family without entering a dark industrial wall or a scroll-trapped spectacle.

This is a Hebrew-first, RTL commercial product experience with a user-pinned 2026 Apple-style discipline, not an imitation of Apple branding or exact layouts. The interface is quiet enough for manufacturer-backed facts to carry authority. Blue marks navigation and action, while Lift Pro lime remains a rare ownership-and-brand signal. Translucent material is reserved for navigation and compact evidence details; primary reading surfaces remain solid and legible.

Mobbin references are translated by behavior rather than copied: Daylight and Samara support the single environmental product stage; Square supports image-first family wayfinding; Klarna and Urban Outfitters support compact, visible catalogue filters and active-state clarity. The resulting composition remains Hebrew RTL, uses Lift Pro's verified machinery, and keeps the catalogue's source constraints intact.

The story proceeds in a fixed commercial order: understand the offer, choose an image-led equipment family, inspect selected models at editorial scale, see ownership support, learn why the company exists, then open a full model page or manufacturer source. Until an approved contact destination exists, the site routes visitors to catalogue, model, selection, company, and document surfaces and never implies that a message, quote request, or form submission has been sent.

**Key Characteristics:**

- Bright, calm spatial fields instead of a continuous industrial backdrop.
- One complete, unframed machine as the dominant first-viewport object.
- Hebrew-first RTL composition with the navigation anchored at the top-right reading origin.
- System-native typography, restrained iridescent color, and soft ambient depth.
- Translucency only where it clarifies navigation or a focused detail.
- Native scrolling, immediate control response, and manufacturer evidence kept close to technical claims.

## Colors

The palette is a cool near-white field with black-gray typography, a precise blue action voice, and a restrained Lift Pro lime signal.

### Primary

- **Decision Blue** (`action-blue`): Primary buttons, active navigation, focus indication, and the decisive phrase in the hero.
- **Decision Blue Hover** (`action-blue-hover`): The brighter response state for primary actions.
- **Source Blue** (`action-blue-bright`, `action-blue-deep`): Controlled gradient glow and emphasized product language; never a general decorative wash.

### Secondary

- **Lift Signal** (`lift-lime`): Small dots, selection highlights, and brand-linked ownership cues.
- **Lift Signal Light** (`lift-lime-light`): High-contrast supporting emphasis within the dark service field.
- **Lift Signal Ink** (`lift-lime-ink`): Text used only when lime becomes a light background.

### Neutral

- **Spatial White** (`page`): The continuous page field and the default equipment-card ground.
- **Optical Glass** (`surface-glass`): Translucent navigation and focused overlay material.
- **Quiet Layer** (`surface-soft`): Subtle separation between adjacent light fields.
- **Primary Ink** (`ink`): Headings and decisive labels.
- **Reading Gray** (`ink-muted`): Body copy and supporting navigation.
- **Evidence Gray** (`ink-subtle`): Metadata and low-priority details.
- **Service Night** (`dark-field`): A single contained ownership-support contrast field, not the site-wide atmosphere.
- **Soft Boundary** (`border-soft`): Low-contrast boundaries where layering alone is insufficient.

**The One Blue Voice Rule.** Blue communicates action, selection, or verified product emphasis; it does not fill large reading fields.

**The Rare Lime Rule.** Lime is a Lift Pro signal, not a dominant interface theme. Keep it small enough that every appearance still means something.

**The Contained Night Rule.** Dark material belongs only to the service-and-ownership proof section. Never turn the page back into a continuous dark industrial wall.

## Typography

**Display Font:** System UI (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, with Arial fallback)

**Body Font:** System UI (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, with Arial fallback)

**Character:** The same optical system stack carries both display and reading roles, producing a clean 2026 product-page cadence without importing a foreign brand voice. Weight, scale, and tight headline tracking establish hierarchy; the Hebrew language remains natural rather than stylized into an industrial trope.

### Hierarchy

- **Display** (`display`): The hero promise only; bold, tightly tracked, centered, and limited to roughly eleven characters per line.
- **Headline** (`headline`): Major section and inner-page titles with balanced wrapping and a compact line box.
- **Title** (`title`): Equipment families and mid-scale content titles.
- **Lead** (`lead`): Hero support copy and prominent explanatory passages, kept within a readable measure of about 42rem.
- **Body** (`body`): Product evidence, ownership guidance, and company copy.
- **Label** (`label`): Eyebrows, compact verified details, and metadata. It uses natural case; uppercase styling is not part of the shipped world.

**The One Family Rule.** Create hierarchy through optical size, weight, line height, and measure; do not introduce a display face for spectacle.

**The Tight Promise Rule.** Large promises use negative tracking and compact line height, while body copy opens to a comfortable reading rhythm.

## Layout

The page uses logical RTL flow and a centered spatial model. The first viewport places the offer and actions above one complete large loader; the floating navigation begins at the top-right reading origin. The hero is constrained to 76rem, the floating navigation to 73rem, normal content to 80rem, and rounded section fields to 92rem. Horizontal gutters remain fluid through the `gutter` token.

Each major story beat occupies its own rounded field with generous vertical space. The sequence is offer, image-led equipment families, selected product stages, direct-sourcing value, service and spare-parts support, company origin, then catalogue and manufacturer-document actions. The page uses native document flow and native scrolling; no section pins the viewport or captures the scroll gesture.

At the intermediate breakpoint (64rem), the header action hides and complex grids compress. Below 47.99rem, the navigation becomes a floating menu, two-column structures become one column, equipment cards shorten, and final actions expand to full width. Below 24rem, hero actions stack. The same semantic and visual reading order is preserved from the 20rem minimum viewport upward, with no horizontal overflow.

**The Complete Machine Rule.** The hero product is shown whole, centered, and unframed. Never crop it into a card, silhouette it behind copy, or use it as a texture.

**The Native Scroll Rule.** Story progression may reveal content once, but it may not trap, scrub, hijack, or artificially lengthen page scrolling.

## Elevation & Depth

The system uses a hybrid of tonal separation, restrained gradients, and ambient shadows. Most content depth comes from the relationship between bright spatial fields. Shadows are reserved for floating navigation, lifted equipment or document cards, and focused translucent details. The machine itself uses a drop shadow to feel physically grounded without gaining a container.

### Shadow Vocabulary

- **Floating navigation** (`0 0.8rem 2.4rem rgba(37, 43, 52, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.92)`): Establishes a calm glass layer above the page.
- **Quiet glass** (`0 0.8rem 2.4rem rgba(45, 49, 58, 0.07), inset 0 1px 0 #fff`): Supports compact proof or detail material.
- **Interactive lift** (`0 1.2rem 2.8rem rgba(37, 43, 52, 0.11)`): Appears only when a selectable equipment card rises on hover.
- **Product grounding** (`drop-shadow(0 2.2rem 2.2rem rgba(25, 34, 44, 0.2))`): Connects the complete machine to its bright field without framing it.

**The Glass With a Job Rule.** Use blur and saturation only for navigation, focused evidence, and compact foreground detail. Ordinary reading cards stay solid or nearly solid.

**The Flat Until Needed Rule.** Resting content is separated by space and tone. Elevation appears when an object floats, receives focus, or responds to interaction.

## Shapes

Large page fields use continuous soft curves through `spatial`; cards and dark proof surfaces use the tighter `card` and `detail` radii; floating glass details use `glass`; primary actions and the navigation shell are fully pill-shaped. Circular arrow and menu controls are true circles. The hero machine has no border, corner, crop, or card silhouette.

Borders are optical rather than structural: light surfaces use low-alpha white or ink boundaries, and the dark support field uses restrained white-alpha edges. In higher-contrast mode, key navigational and content containers gain a two-pixel current-color boundary.

**The Scale-Matched Curve Rule.** The larger the spatial field, the broader its curve; compact evidence and selectable cards stay tighter and more precise.

**The No Product Frame Rule.** Shape belongs to the field around the product, never to the machine image itself.

## Components

### Buttons

Buttons are direct, calm, and immediately responsive.

- **Shape:** Fully pill-shaped (`pill`) with a minimum 3.05rem control height.
- **Primary:** Decision Blue with white text and compact horizontal padding.
- **Secondary:** Translucent white with a low-alpha blue edge and Decision Blue text.
- **Hover / Focus:** Primary actions brighten and gain a small blue ambient shadow; all keyboard focus uses a visible three-pixel blue outline with offset.
- **Pressed:** Buttons scale to 97% for immediate physical acknowledgement.

### Navigation

The navigation is a floating, translucent pill anchored at the RTL reading origin. Its logo preserves the complete approved transparent artwork and native aspect ratio. Desktop links stay quiet until hover or active state; the primary catalogue action uses Decision Blue. On mobile, a circular control opens a rounded glass menu, Escape closes it and returns focus, and selecting a link closes it.

### Equipment Cards

Equipment-family cards are spacious image-led selectors rather than catalogue-detail cards. Each uses a gentle family-specific tint, a verified manufacturer-derived machine image, strong title, concise job-oriented description, a visible destination label, and no resting border. Hover lifts the card by four pixels while the image scales subtly and the directional label advances; press scales the card down immediately.

Selected models appear in large editorial stages between family selection and ownership value. Their real catalogue imagery remains the dominant object, exact key specifications stay close to the model name, and every stage links to a standalone model URL. The model page repeats the large verified image, key specifications, manufacturer-source action, selection guidance, and three related models without inventing commercial claims.

The hero places the verified complete loader over a generated, product-free quarry environment. The environmental asset supplies context only: it contains no machinery, people, logos, signage, or technical evidence, and it must never replace the separate verified loader layer.

### Catalogue Discovery

The catalogue opens with four image-first family destinations, then exposes two compact filter axes: equipment family and manufacturer. Both axes retain visible pressed states, combine predictably with search, update the result count immediately, serialize to the URL, and reset together. Desktop keeps the controls in a floating material toolbar; mobile shows every option without horizontal scrolling or a hidden filter drawer.

### Verified Detail

The compact pill below the complete machine groups the direct-import, need-fit, and local-service signals. It uses optical glass, a fine white edge, a small Lift Signal dot, and restrained label typography. It is hidden where the narrow viewport cannot preserve the detail cleanly.

### Service Proof

The ownership-support section is the sole dark contrast field. Its percentage claim sits in a focused translucent proof surface and must always remain qualified by part, model, and supply source. Related service points use low-alpha bordered containers rather than decorative icons or claims.

### Spatial Sections

Equipment, value, service, company, and final-action chapters are independent rounded fields. Each receives one purposeful tonal or radial atmosphere; the content hierarchy, not decorative illustration, carries the chapter.

Content groups reveal once with a 520ms opacity-and-16px rise using the `ease-out` curve. `prefers-reduced-motion` removes spatial motion, and `prefers-reduced-transparency` replaces glass with solid surfaces. `prefers-contrast: more` strengthens key boundaries and reading colors.

## Do's and Don'ts

### Do:

- **Do** begin with the visitor's work and equipment family, then reveal model detail and manufacturer evidence.
- **Do** present one complete, large machine as the first-viewport product object.
- **Do** preserve Hebrew-first RTL order, visible focus, responsive logical layout, and native scrolling.
- **Do** keep the approved `lift-pro-26-logo-transparent.png` uncropped on its transparent canvas and at its native aspect ratio.
- **Do** keep manufacturer source documents one step away from every technical claim.
- **Do** qualify the spare-parts percentage by part, model, and source every time it appears.
- **Do** provide solid and reduced-motion fallbacks for translucent and spatial treatments.

### Don't:

- **Don't** recreate a dark industrial wall, a scroll-trapped hero, or a software-dashboard aesthetic.
- **Don't** copy Apple branding, language, or exact page layouts; carry only the approved 2026 product-design principles.
- **Don't** crop, frame, backdrop, or partially conceal the canonical logo or hero machine.
- **Don't** spread glass across ordinary reading surfaces or use lime as the dominant interface color.
- **Don't** invent prices, finance terms, stock, delivery times, warranty terms, certifications, testimonials, or contact details.
- **Don't** imply that a message, quote request, or form submission was sent while no approved commercial contact destination exists.
- **Don't** use raw PDF embeds as the customer-facing catalogue; semantic HTML is the primary equipment experience and PDFs remain optional source downloads.
