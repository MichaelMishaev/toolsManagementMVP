# Lift Pro 26 customer-demo design system

**Status:** Phase B multi-role customer demo implemented locally  
**Product:** Lift Pro 26
**Company identity:** Lift Pro 26 Israel Ltd. (`ליפט פרו 26 ישראל בע״מ`)
**Surface:** Hebrew-first RTL field-service PWA  
**Selected direction:** 01, Next Job Command  
**Last updated:** 12 August 2026

## 1. Design intent

Lift Pro 26 is the company-branded operational field-service product for customers, service desks, technicians, managers, and parts staff. The product should feel dependable in a warehouse, service vehicle, or office. Visual design must help users act quickly; it must not compete with the work.

The system originates in the technician home and one question: **what should I do next?** The next scheduled call dominates and the rest of the day remains visible but secondary. The same hierarchy extends into a seven-step, multi-role customer demonstration without adding dashboard decoration or unapproved MVP scope.

Design dials:

- `DESIGN_VARIANCE: 4`: structured with modest asymmetry on desktop.
- `MOTION_INTENSITY: 4`: restrained feedback and one ambient media layer.
- `VISUAL_DENSITY: 6`: information-rich but not cockpit-dense.

## 2. Brand hierarchy

- Lift Pro 26 is the application name and primary product identity, as defined by `docs/PRDs/PRD.md` and `docs/clientSystemAnaluse_1.html`.
- Follow `assets/brand/README.md` for provenance and approved usage.
- Use `assets/brand/lift-pro-26-logo-transparent.png` as the canonical artwork.
- Preserve its transparent canvas and aspect ratio; do not crop it into a dark rectangle or add a backdrop.
- Do not redraw, recolor, regenerate, or replace the logo. Do not reintroduce the removed client screenshot or superseded `liftvoltraq-*` assets.
- The visible lockup pairs `ליפט פרו 26` with the functional label `מערכת שירות שטח`.
- Generated media may not contain logos, text, trademarks, or watermarks.

## 3. Machine-readable tokens

The JSON block below is the canonical token source. Run `node scripts/sync-design-tokens.mjs` after changing it. The script generates both token CSS and the final application CSS, including design-token breakpoint substitutions. Generated CSS must never be edited directly.

```design-tokens
{
  "meta": {
    "name": "Lift Pro 26",
    "version": "2.1.0",
    "direction": "rtl",
    "theme": "dark-industrial"
  },
  "tokens": {
    "color": {
      "page": "#070A0C",
      "background": "#0B0F11",
      "surface": "#141A1D",
      "surfaceRaised": "#1B2226",
      "surfaceMuted": "#101518",
      "surfaceInteractive": "#20282C",
      "border": "#30383D",
      "borderStrong": "#4A555B",
      "text": "#F3F6F4",
      "textMuted": "#B3BCBE",
      "textSubtle": "#879296",
      "accent": "#9BCB42",
      "accentStrong": "#B5E85A",
      "accentInk": "#142003",
      "accentMuted": "rgba(155, 203, 66, 0.16)",
      "danger": "#FF746C",
      "dangerMuted": "rgba(255, 116, 108, 0.14)",
      "focus": "#C9F77E",
      "scrim": "rgba(5, 9, 10, 0.78)",
      "scrimStrong": "rgba(5, 9, 10, 0.92)",
      "mediaWash": "rgba(8, 12, 14, 0.38)",
      "selection": "rgba(155, 203, 66, 0.28)",
      "transparent": "transparent"
    },
    "font": {
      "family": "\"Heebo\", \"Noto Sans Hebrew\", Arial, sans-serif",
      "weightRegular": "400",
      "weightMedium": "500",
      "weightSemibold": "600",
      "weightBold": "700",
      "weightBlack": "800",
      "sizeXs": "0.75rem",
      "sizeSm": "0.875rem",
      "sizeBase": "1rem",
      "sizeMd": "1.125rem",
      "sizeLg": "1.375rem",
      "sizeXl": "1.75rem",
      "size2xl": "2.25rem",
      "lineTight": "1.15",
      "lineNormal": "1.5",
      "lineRelaxed": "1.65"
    },
    "space": {
      "2xs": "0.25rem",
      "xs": "0.5rem",
      "sm": "0.75rem",
      "md": "1rem",
      "lg": "1.25rem",
      "xl": "1.5rem",
      "2xl": "2rem",
      "3xl": "2.5rem",
      "4xl": "3.5rem",
      "5xl": "4.5rem"
    },
    "radius": {
      "sm": "0.625rem",
      "md": "0.875rem",
      "lg": "1.25rem",
      "xl": "1.625rem",
      "pill": "999px"
    },
    "shadow": {
      "card": "0 1.25rem 3.5rem rgba(0, 0, 0, 0.32)",
      "raised": "0 0.875rem 2rem rgba(0, 0, 0, 0.28)",
      "focus": "0 0 0 0.2rem rgba(201, 247, 126, 0.30)"
    },
    "motion": {
      "fast": "140ms",
      "base": "220ms",
      "slow": "500ms",
      "ease": "cubic-bezier(0.16, 1, 0.3, 1)"
    },
    "size": {
      "tap": "3rem",
      "icon": "1.375rem",
      "headerMobile": "5.5rem",
      "bottomNav": "5rem",
      "sidebar": "15.5rem",
      "contentMax": "80rem",
      "jobMediaMobile": "10.5rem",
      "jobMediaDesktop": "20rem"
    },
    "breakpoint": {
      "mobile": "30rem",
      "tablet": "48rem",
      "desktop": "64rem",
      "wide": "90rem"
    },
    "layer": {
      "background": "-1",
      "base": "0",
      "nav": "20",
      "feedback": "50",
      "skip": "100"
    }
  }
}
```

## 4. Color

- The page uses one dark theme. Sections may vary only within the charcoal surface family.
- Green is the only operational accent. Use it for the primary action, active navigation, focus support, and selected state.
- Red is reserved for genuine urgency. Pair it with the word `דחוף` and an alert icon.
- Never use color alone to communicate state.
- Body copy must meet WCAG AA. Target AAA for primary job information where practical.
- Pure black and pure white are not part of the palette.

## 5. Typography

- Use locally hosted Heebo with system Hebrew fallbacks.
- Bold is reserved for page titles, customer/site names, and primary values.
- Supporting information uses regular or medium weight with the muted text token.
- Keep Hebrew labels short and natural. Do not translate English interface idioms mechanically.
- Times and call numbers use `dir="ltr"`, tabular numerals, and explicit bidi isolation.
- Avoid uppercase, condensed type, decorative serif, and artificially tight tracking.

## 6. Spacing, layout, and shape

- Use the token spacing scale only.
- Mobile content uses one column and keeps the primary CTA within comfortable thumb reach.
- Tablet may place media beside job details while preserving reading order.
- Desktop uses an RTL side rail and an asymmetric main workspace capped by `size.contentMax`.
- Cards represent real repeated objects: calls. Avoid putting cards inside cards.
- Cards use `radius.lg`; the featured call uses `radius.xl`; buttons use `radius.md`.
- Borders communicate grouping. Shadows are restrained and tinted by the dark environment.

## 7. Component contracts

### App shell

- Mobile: header, scrollable main, fixed bottom navigation, safe-area padding.
- Desktop: fixed RTL side rail and independent main workspace.
- Logo, route label, and active navigation make location obvious.

### Next-call card

Order:

1. Call number and urgent state.
2. Customer/site name.
3. Equipment and fault.
4. Time and city.
5. Equipment image.
6. One primary action: `פתח קריאה`.

The card does not contain navigation, status updates, parts, signature, or closure actions. Those belong to the deeper task routes.

### Later-call row

- Customer/site and equipment are primary.
- Time and location remain visible.
- The row has no competing primary CTA.
- The whole row may become a destination after Phase B approval.

### Navigation

- Four destinations: Calls, Calendar, Equipment, Profile.
- Active state combines accent color, a filled background region, and `aria-current="page"`.
- Use one local Phosphor icon family. Icons support labels; they never replace them.

### Feedback toast

- Used for concise success and confirmation feedback that does not require a modal decision.
- Plain language identifies what changed and preserves the user's current task context.
- Uses `role="status"` and disappears without stealing focus.

### Multi-role workflow

- Customer request: one progressive form with equipment, fault, optional photo, and a single submit action.
- Service desk: desktop master-detail queue with filters immediately above the call list; a single-column sequence on mobile.
- Technician treatment: status first, then findings and work performed, then a dedicated close flow.
- Parts: searchable by part name or SKU only; no stock or purchasing claims.
- Signature: dedicated stage with signer name, canvas input, keyboard alternative, clear, save, and saved feedback.
- Manager: read-only closed-call summary and chronological history, without invented KPI cards.
- Report: a light printable document inside the dark application shell.

## 8. Motion and media

- Motion communicates hierarchy or feedback only.
- The Higgsfield loop is a decorative background layer with a fixed camera and subtle ambient movement.
- Video is muted, inline, noninteractive, and excluded from the accessibility tree.
- The poster remains visible until video can play.
- `prefers-reduced-motion: reduce` disables video and nonessential transforms.
- Data-saving conditions keep the poster and do not fetch the video.
- Animate only opacity and transform. No scroll listeners or continuous JavaScript animation loops.

## 9. Accessibility and RTL

- Root document: `lang="he"`, `dir="rtl"`.
- Use header, nav, main, section, and footer landmarks.
- Include a visible-on-focus skip link.
- Default tap target is 48px; never below 44px.
- Focus uses both outline and focus-shadow tokens.
- Maintain logical DOM order across responsive layouts.
- Directional chevrons must be verified after RTL rendering.
- Decorative icons use `aria-hidden="true"`; icon-only controls require Hebrew accessible names.
- Generated equipment photography needs concise functional alt text. Decorative media uses empty alt text or is hidden.

## 10. Imagery

- Equipment imagery helps recognition but never replaces equipment text.
- Use realistic industrial materials, imperfect wear, and credible warehouse lighting.
- No real customers, identifiable workers, logos, labels, trademarks, text, or watermarks.
- The equipment image should remain legible as a compact mobile crop.
- The background poster needs quiet negative space and enough darkness for a stable scrim.

## 11. Interaction states

- Default: obvious hierarchy and one primary action.
- Hover: subtle surface lift on pointer devices only.
- Focus: visible high-contrast outline and focus shadow.
- Active: small downward compression, never a large bounce.
- Disabled: lower contrast plus disabled semantics; do not use opacity alone.
- Loading: reserve final dimensions and use a shape-matched skeleton in Phase B.
- Empty/error: provide explicit copy and recovery actions. Offline operation is outside MVP scope.
- Success: acknowledge the action near its source without unexpected navigation.

## 12. Reference decisions

- Jobber: adopt next-visit dominance and persistent bottom navigation.
- DoorDash Dasher: adopt current-task context paired with one action, without the unapproved map.
- Angi: adopt progressive disclosure between home and detail.
- Jobber signature: use a dedicated signature surface with clear and saved states.
- Relevance AI: keep queue filters directly above the desktop service-desk list.
- Jobber service request: adapt the long-form request hierarchy and strong final action.
- Zendesk queue: adapt the desktop master-detail relationship without copying its visual style.
- Fresha signature: adapt the focused signature state and explicit confirmation.

Do not copy visual styling or English LTR placement from those products.

## 13. Anti-patterns

- No glassmorphism, AI-purple glow, gradient text, or decorative status dots.
- No map or “navigate” CTA until CR-4 is approved.
- No route optimization or traffic implications.
- No fake KPIs, performance metrics, inventory counts, or external notification claims.
- No hidden gestures, mystery icons, nested menus, or hover-only controls.
- No phone frame on desktop.
- No generated logo or brand alteration.
- No external runtime font, icon, image, script, video, analytics, or cookie dependency.
- No backend, authentication, permanent uploads, analytics, or external runtime requests.
