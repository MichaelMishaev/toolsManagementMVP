# Customer-demo media record

**Status:** Local project assets, verified 11 August 2026.  
**Runtime rule:** The mock performs no external media requests.

## OpenAI image-generation assets

Use case: `photorealistic-natural`.

### Equipment image

Final prompt:

> Photorealistic generic orange-and-charcoal 3-ton counterbalance forklift parked inside a dark industrial service workshop. Three-quarter front view, realistic wear and materials, credible workshop lighting, clear equipment silhouette, no people. No visible manufacturer logo, trademark, text, label, plate, or watermark.

Files:

- Source: `mock/assets/generated/equipment-forklift-source.png`
- Runtime: `mock/assets/generated/equipment-forklift.webp`

### Industrial poster

Final prompt:

> Wide 16:9 photorealistic industrial equipment-service warehouse interior, fixed-camera composition, dark charcoal materials, restrained practical lighting, subtle haze, generous quiet negative space, trustworthy B2B atmosphere. No equipment movement, people, logo, trademark, text, sign, or watermark.

Files:

- Source: `mock/assets/generated/industrial-ambient-poster-source.png`
- Runtime: `mock/assets/generated/industrial-ambient-poster.webp`

## Higgsfield background animation

The poster was used as the start image for one restrained 6-second, 16:9, 720p, silent image-to-video generation.

Motion prompt:

> Fixed camera. Only slight practical-light movement and very restrained atmospheric haze. The warehouse and all equipment remain still. No camera motion, dramatic effects, people, text, logo, or watermark.

Files:

- Higgsfield source: `mock/assets/generated/industrial-ambient-loop-higgsfield-source.mp4`
- Optimized fallback: `mock/assets/generated/industrial-ambient-loop.mp4`
- Optimized preferred variant: `mock/assets/generated/industrial-ambient-loop.webm`

The runtime retains the poster until playback succeeds and disables video for reduced-motion preference, data-saving conditions, non-technician routes, or unsupported playback.
