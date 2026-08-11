# LiftVoltraq customer-demo implementation plan

**Status:** Complete multi-role mock implemented, verified locally, and approved for GitHub Pages publication.  
**Runtime:** Static HTML, CSS, and JavaScript only.  
**Local URL:** `http://localhost:8000/mock/`  
**GitHub Pages URL:** `https://michaelmishaev.github.io/toolsManagementMVP/mock/`

## 1. Purpose and approval boundary

The customer demo explains the confirmed LiftVoltraq field-service MVP through a believable, front-end-only experience configured for Lift Pro 26 Israel Ltd. It must feel like a native operational product while remaining honest about its limitations: it has no authentication, backend, database, real uploads, analytics, cookies, or permanent customer data.

Phase A established the responsive technician-home direction and proved the visual system, Hebrew RTL behavior, mobile navigation, desktop adaptation, imagery, and ambient motion.

Michael's explicit request to implement the whole mock opened Phase B. It extends the same system into the complete multi-role scenario without changing the established visual foundation. Michael authorized publication to the current repository's existing GitHub Pages site on 11 August 2026.

## 2. Source hierarchy

1. The Apple Pages specification under `docs/PRDs/`.
2. `docs/PRDs/PRD.md` for structured requirements and IDs.
3. `docs/clientSystemAnaluse_1.html` for client-facing Hebrew language and tone.
4. `design/design.md` for the approved visual and interaction system.

The demo may visualize confirmed requirements but must not silently promote candidate requirements or future phases into the MVP.

## 3. Information architecture

### Primary route

- `#/technician/home`: Technician Next Job home.

### Responsive hierarchy

Mobile:

1. Skip link.
2. Exact LiftVoltraq product badge and name, with Lift Pro 26 shown only as the customer/tenant.
3. Greeting and in-system notification control.
4. Next-call heading.
5. Dominant next-call card.
6. Two later calls.
7. Safe-area-aware bottom navigation.

Desktop:

1. Persistent RTL side navigation.
2. Brand and tenant identity.
3. Main page heading and notification control.
4. Large next-call workspace.
5. Remaining daily schedule.
6. Demo disclosure in the page footer.

The desktop view is an adaptive workspace, not a mobile phone shown inside a desktop frame.

### Implemented routes

- `#/customer/new-call`
- `#/desk/queue`
- `#/technician/home`
- `#/technician/call/2458`
- `#/technician/close/2458`
- `#/parts/catalog`
- `#/manager/call/2458`
- `#/customer/calls/2458/report`
- `#/legal/demo-terms`
- `#/legal/privacy`
- `#/legal/accessibility`

## 4. Phase A scenario data

All data is fictional and bundled with the page.

| Field | Value |
|---|---|
| Call | `#2458` |
| Customer/site | מרכז לוגיסטי דרום |
| Equipment | מלגזת Toyota, 3 טון |
| Fault | נזילה במערכת ההידראולית |
| Location | באר שבע |
| Window | היום, 10:30-12:00 |
| Urgency | דחוף |
| Technician | דוד |

Later calls:

- מחסן ציוד הנדסי, מלגזה 2.5 טון, אשקלון, 13:30-15:00.
- מפעל מתכת הדרום, בובקט S770, דימונה, 16:00-17:30.

## 5. Native and simple interaction rules

- The technician home answers one question: what should I do next?
- The next call receives the only primary CTA: `פתח קריאה`.
- CR-4 navigation is not shown because it remains a candidate requirement.
- Secondary jobs remain readable but visually quiet.
- Navigation is role-specific and keeps only the destinations needed by the current customer, desk, technician, manager, or parts task.
- Important information is visible without opening menus: site, equipment, time, city, fault, and urgency.
- No hidden gestures, hover-only actions, nested card stacks, fake KPIs, maps, or route-optimization claims.
- Buttons provide visible hover, focus, and pressed states. Links remain links.
- Each role receives one clear next action; the CTA advances the deterministic scenario to the next native task.

## 6. Responsive behavior

- `320-767px`: single-column mobile layout with fixed bottom navigation and safe-area padding.
- `768-1023px`: roomier single-column layout; job media and details may share a row.
- `1024px+`: persistent RTL side rail and two-column operational workspace.
- `1440px+`: content stops growing at the design-system maximum width.
- LTR data such as times and call numbers is isolated with `dir="ltr"`.
- No horizontal overflow is permitted at any breakpoint.

## 7. Design and media architecture

`design/design.md` is the human-readable and machine-readable source of truth. Its fenced `design-tokens` JSON block is converted by `scripts/sync-design-tokens.mjs` into `mock/assets/design-tokens.css`. The same script resolves breakpoint placeholders in `mock/assets/app.template.css` and generates the deployable `mock/assets/app.css`.

Development commands:

```sh
node scripts/sync-design-tokens.mjs
node scripts/sync-design-tokens.mjs --watch
node scripts/sync-design-tokens.mjs --check
```

All operational CSS consumes generated semantic variables. Breakpoint values are injected from the same token source, so responsive rules stay synchronized too. The runtime loads no remote font, icon, image, script, or video.

Media:

- OpenAI-generated generic forklift image for equipment recognition.
- OpenAI-generated industrial warehouse poster for ambience.
- Higgsfield-generated silent ambient loop derived from the poster.
- Poster fallback for reduced motion, data saving, unsupported video, and loading.
- The animation is decorative and has no semantic content.

## 8. Mobbin design evidence

- [Jobber next-visit home](https://mobbin.com/screens/c3fc8f9e-52c4-465b-a55c-b7ac5eeec9a8): make the next assignment dominant.
- [DoorDash current job](https://mobbin.com/screens/5859ffb5-02a0-45ee-9065-2ea87eaf43fa): keep current context and immediate action together.
- [Angi projects](https://mobbin.com/screens/4ea190d7-5a91-424e-ac6c-b5609ef2a510): progressively disclose deeper details.
- [Jobber signature flow](https://mobbin.com/flows/c90733eb-77d2-48eb-94d1-2aabf2835ff1): reserve signature for a dedicated Phase B step.
- [Relevance AI task filters](https://mobbin.com/screens/7690aff3-4875-4930-9b99-52e52a7f0b07): place Phase B desktop filters directly above the queue.
- [Jobber service request](https://mobbin.com/screens/1b3a7d01-7591-4250-a3dc-2eac5fa91d00): preserve one clear request form and a strong final action.
- [Jobber dispatch queue](https://mobbin.com/screens/7b0579b2-4f76-41d9-a57a-01402ca970f1): keep list controls attached to the work queue.
- [Zendesk queue](https://mobbin.com/screens/5d86d62d-58a7-456a-92d5-f06e79a77215): use a desktop master-detail relationship without adding KPI decoration.
- [Fresha signature](https://mobbin.com/screens/49c59cef-0ec8-4755-9366-d35601c40050): keep signature capture focused and visibly confirmed.

Rejected patterns:

- Copying LTR navigation placement directly into Hebrew RTL.
- Map-first presentation before CR-4 is approved.
- Showing every call field on the home screen.
- Dense desktop tables on the technician home.
- Permanent presenter controls inside the native product shell.

## 9. Accessibility and trust

- `lang="he"` and `dir="rtl"` at document level.
- Semantic landmarks and headings.
- Visible skip link and logical keyboard order.
- Minimum 44px targets; 48px is the default token.
- WCAG AA contrast for text and controls.
- Urgency uses icon, text, and color together.
- Decorative motion is hidden from assistive technology.
- `prefers-reduced-motion` disables video and nonessential transitions.
- The page states that it is a fictional demo with no data submission.

Public legal wording is limited to demo-specific Terms, Privacy, and Accessibility pages. Existing `docs/compliance/` drafts remain unpublished pending qualified Israeli legal review.

## 10. Phase B state contract

Demo state is stored for the current tab only:

```json
{
  "version": 1,
  "currentRole": "technician",
  "scenarioStep": 3,
  "callId": 2458,
  "callStatus": "scheduled",
  "treatment": {
    "summary": "",
    "parts": [],
    "photos": [],
    "signature": null
  }
}
```

Storage key: `liftvoltraq.demo.v1`. A reset action restores deterministic sample data. Presenter controls are available only with `?demo=1`; role switching changes routes while scenario-step switching loads the matching deterministic snapshot.

## 11. Verification and approval

The complete mock is ready for review only when:

- design-token generation and `--check` pass;
- the page loads with no external network requests or console errors;
- mobile checks pass at 320×700 and 390×844;
- tablet checks pass at 768×1024;
- desktop checks pass at 1024×768 and 1440×900;
- keyboard focus, skip link, CTA feedback, and navigation states work;
- Hebrew RTL and LTR numeric runs render correctly;
- reduced-motion mode shows the poster instead of the video;
- pre-existing root-page worktree changes remain untouched by this implementation;
- the full seven-step happy path and all three legal pages work;
- screenshots are captured for the 390×844 and 1440×900 approval views.

The existing root specification remains the Pages entry document. The customer demo is published beneath `/mock/`. Internal compliance drafts, PRD source bundles, agent files, and QA artifacts are not part of the publication commit.

### Local verification record — 11 August 2026

- The seven-step happy path completed from customer request through printable report.
- Direct pre-closure report access shows a pending state and does not fabricate photos, signature, timestamps, or closed status.
- Service-desk urgency and part quantity/note edits persist in session-only state.
- Native close flow reaches the read-only manager result and cannot repeat closure.
- No horizontal overflow at 320, 390, 768, 1024, or 1440 CSS pixels.
- Visible controls meet the 44px minimum at the checked mobile and desktop views.
- One page-level `h1`, local-only runtime assets, and zero browser console warnings/errors were verified.
- The 6.04-second Higgsfield loop has optimized MP4/WebM variants and poster, reduced-motion, data-saving, and unsupported-browser fallbacks.
- Approval captures are stored in `output/playwright/` for 390×844 and 1440×900.
