---
name: premium-landing-pages
description: Design, build, redesign, or polish modern high-converting landing pages with native scrolling, editorial layouts, section-aware global background-color transitions inspired by the interaction style of msx.co.il, restrained one-time reveal motion, responsive behavior, and accessible contrast. Use for marketing sites, campaign pages, product launches, service-business landing pages, or catalogue-led commercial websites where Codex must implement and browser-verify a premium conversion experience without scroll hijacking or heavy animation.
---

# Premium Landing Pages

Build fast, confident landing pages whose motion supports the message. Use the section-to-section background behavior of `msx.co.il` as interaction inspiration only; do not copy its brand, content, assets, or exact composition.

## Workflow

1. Read repository instructions and inspect `git status` before editing.
2. Inspect the existing framework, routes, component patterns, design tokens, fonts, icons, assets, motion utilities, testing setup, and nearby landing-page code. Extend the existing stack; do not introduce a new framework or animation library without a demonstrated need.
3. Confirm the page's audience, offer, primary conversion action, and visual source. Reuse supplied brand and product assets. When imagery is required but missing, obtain or generate suitable real imagery rather than using placeholder boxes, CSS drawings, or emoji.
4. Define a concise section plan. Give each major section one message and one conversion purpose.
5. Select a small accessible palette and map one background and foreground token pair to each major section. Reuse colors where appropriate; novelty is not a requirement.
6. Before implementation, briefly state the proposed section structure and color flow, for example: `Hero - warm white -> Proof - charcoal -> Offer - ochre -> CTA - deep green`.
7. Implement the smallest coherent page using semantic HTML and the project's conventions.
8. Verify the rendered page on desktop, mobile, keyboard navigation, reverse scrolling, and reduced motion. Fix visible or behavioral defects before handoff.

## Conversion Structure

Prefer this hierarchy unless the offer requires a different flow:

1. Hero: clear outcome, short supporting copy, primary CTA, and one strong visual.
2. Trust: customer evidence, credible numbers, logos, certifications, or specific proof.
3. Problem or context: demonstrate understanding without overexplaining.
4. Offer: explain the product or service in concrete, scannable terms.
5. Detail: show categories, capabilities, process, catalogue items, or examples.
6. Objection handling: answer the few concerns that block conversion.
7. Final CTA: restate the value and provide one obvious next action.

Remove sections that lack a distinct message. Avoid repeating the same CTA copy and supporting text in every section.

## Visual Direction

- Use large editorial typography with a disciplined responsive type scale.
- Create strong hierarchy, generous whitespace, and deliberate alignment.
- Prefer a minimal, confident composition over decorative card grids.
- Use real, well-cropped imagery with correct aspect ratios and useful alt text.
- Keep each section visually legible on its own background.
- Build mobile-first, then use wider layouts to increase breathing room rather than merely enlarging everything.
- Make the primary CTA visually dominant while keeping secondary actions quiet.

## Section Background Behavior

- Preserve native browser scrolling. Never intercept wheel, touch, trackpad, keyboard, or scrollbar behavior.
- Assign each major section an explicit accessible color set: background, foreground, muted text, border, primary action, action text, icon, and focus-ring colors.
- Transition the global page background to the active section's background as the section crosses a stable viewport activation zone.
- Make activation deterministic in both directions. Scrolling back up must restore the previous section's colors.
- Prefer `IntersectionObserver` with a center-biased activation zone. Account for short sections, tall sections, fast scrolling, and multiple intersecting sections; choose the section closest to the activation line instead of relying on callback order.
- Apply the active color tokens to one global page shell or the document root. Do not animate separate full-screen overlays.
- Use a `500-800ms` `ease-in-out` transition for background and foreground color properties. Keep the exact duration consistent across the page unless the existing design system supplies an equivalent token.
- Update text, muted text, links, buttons, borders, icons, and focus styles from the active section's token set. Never assume that changing only the background preserves contrast.
- Avoid flashes on initial load by setting the first section's palette in the initial HTML or CSS state.

## Entrance Motion

- Reveal content only when it first enters the viewport.
- Use `opacity: 0 -> 1` and `translateY(16px) -> 0`.
- Use a `400-600ms` duration with subtle `ease-out` or the project's equivalent premium easing.
- Stagger related cards or list items by `60-100ms`; keep total staged delay restrained.
- Animate once, then unobserve the element. Do not replay entrances while scrolling back and forth.
- Keep content visible by default. Add the hidden pre-animation state only after JavaScript confirms motion is enabled, so script failure cannot hide content.
- Do not animate every small label, icon, or paragraph independently. Group related content into a few meaningful reveal units.

## Reduced Motion

- Respect `prefers-reduced-motion: reduce` in both CSS and JavaScript.
- Show all content immediately with no transform or opacity reveal.
- Remove or effectively eliminate background transition animation while still updating colors correctly.
- Do not initialize reveal observers when reduced motion is active.
- Handle preference changes during the session when practical in the existing stack.

## Prohibited Patterns

Do not use:

- pinned or sticky full-screen storytelling sections;
- scroll hijacking, artificial scroll smoothing, or wheel interception;
- scroll-controlled video;
- canvas, WebGL, or image-sequence animation;
- animated background imagery;
- excessive parallax;
- continuous or looping decorative motion;
- heavy animation dependencies when CSS and `IntersectionObserver` are sufficient.

Normal sticky navigation is acceptable when it improves wayfinding and does not pin the narrative content.

## Accessibility and Performance

- Use semantic landmarks and correctly ordered headings.
- Keep all interactions keyboard-operable with visible `:focus-visible` treatment.
- Meet WCAG AA contrast: at least `4.5:1` for normal text and `3:1` for large text and essential UI boundaries.
- Recheck contrast for every section palette, including hover, active, disabled, and focus states.
- Preserve logical DOM order across responsive layouts.
- Give images dimensions, responsive sources when available, and lazy loading below the fold.
- Avoid layout shifts, oversized media, unnecessary client JavaScript, and duplicate observers.
- Preserve usable content and conversion actions when motion or JavaScript is unavailable.

## Verification Gates

Do not call the page complete until all applicable checks pass:

1. Scroll down through every major section and confirm the global background follows the mapped order.
2. Scroll back up and confirm every prior background and foreground palette is restored.
3. Test at one representative desktop viewport and one narrow mobile viewport; check wrapping, cropping, touch targets, and horizontal overflow.
4. Enable reduced motion and confirm all content is immediately visible, colors still update, and no entrance motion plays.
5. Navigate all links and controls by keyboard and confirm visible focus against every active background.
6. Confirm reveals run once only and do not replay on reverse scrolling.
7. Confirm ordinary wheel, touch, keyboard, scrollbar, anchor-link, and browser find behavior remains native.
8. Run the smallest relevant lint, type, test, or build checks provided by the repository.

Report the chosen section/color flow, changed files, rendered checks performed, and any verification that could not be completed.
