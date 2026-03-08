# RailMutual Connect

## Current State

The landing page (`LandingPage.tsx`) has:
- A header with deep blue background, logo (icon + coded text), Login and Create Profile buttons
- A hero section with white/light background, subtle low-opacity railway image overlay (7% opacity), and left-aligned content
- Stats bar with blue background and orange numbers
- Features grid (4 cards, white background)
- How It Works section (light blue/grey background, 3 steps with orange numbered circles)
- Important Notice section (orange-50 background with orange left border)
- Footer (dark blue background)

The hero feels flat and light — no cinematic depth. The background image is nearly invisible at 7% opacity.

A new cinematic background image has been generated at:
`/assets/generated/hero-railway-cinematic.dim_1920x1080.jpg`

## Requested Changes (Diff)

### Add
- Full-height cinematic hero section with the new railway locomotive background image displayed prominently (not at 7% opacity — the image should be clearly visible)
- Multi-layer dark overlay on the hero: bottom-to-top gradient from `#0B2C4A` (deep navy) at bottom, semi-transparent navy in middle, transitioning toward orange tint at top edge — so text is always readable against the image
- Orange accent glow/highlight element behind the locomotive area to reinforce the orange brand color
- Large bold hero headline with "Mutual Transfer" words highlighted in `#F97316` orange
- Hero subheadline paragraph with a subtle dark backdrop for readability
- Large rounded CTA buttons: "Create Profile" in `#F97316` orange (primary), "Login" in white/light grey (secondary)
- Trust badge pills below CTAs (Secure, Free to Use, Indian Railways Only)
- Decorative orange horizontal accent line separating hero from stats bar
- Light section dividers between post-hero sections

### Modify
- Hero section: change from white/light background to dark cinematic (deep navy + railway image)
- Hero section: increase height to `min-h-[85vh]` or `min-h-[600px]` for cinematic feel
- Hero section: text colors change from dark blue to white (since background is now dark)
- Hero logo text: "RailMutual" in white, "Connect" in `#F97316` orange (already correct but needs to show on dark bg)
- Stats bar: keep dark blue but add stronger orange accent bottom border
- Features section: keep white/light — creates strong contrast break after dark hero
- How It Works section: keep light grey background — adds contrast rhythm
- Important Notice: keep orange-50/beige background — already correct
- Footer: keep dark blue — bookends the page with dark hero at top and dark footer at bottom
- CTA buttons in hero: make them larger (`size="lg"`), fully rounded (`rounded-full`), with proper padding
- The "How It Works" section scroll target anchor remains functional

### Remove
- The 7% opacity background image in the hero (replaced by the full cinematic image)
- The subtle grid pattern overlay in the hero (replaced by layered gradient overlay)
- White/light background from hero section

## Implementation Plan

1. Update `LandingPage.tsx` hero section:
   - Set `backgroundImage` to `/assets/generated/hero-railway-cinematic.dim_1920x1080.jpg`
   - Set backgroundSize to `cover`, backgroundPosition to `center 30%` (emphasizes locomotive upper half)
   - Remove old 7% opacity image and grid pattern divs
   - Add layered overlay divs:
     - Layer 1: `linear-gradient(to top, #0B2C4A 0%, rgba(11,44,74,0.82) 40%, rgba(11,44,74,0.55) 75%, rgba(11,44,74,0.4) 100%)`
     - Layer 2: subtle orange accent at far right edge: `linear-gradient(to left, rgba(249,115,22,0.15) 0%, transparent 50%)`
   - Change hero container to dark (`text-white`)
   - Update logo text: "RailMutual" white, "Connect" `#F97316`
   - Update h1 to white with "Mutual Transfer" in `#F97316`
   - Update description paragraph to `text-white/80`
   - CTA buttons: "Create Profile" → `bg-[#F97316] hover:bg-[#EA6C10] text-white rounded-full px-8`; "How It Works" → `bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-full px-8`
   - Trust badges: white/translucent style on dark background
   - Add thin orange bottom border accent line to hero: `h-1 bg-gradient-to-r from-[#F97316] to-[#0B2C4A]`

2. Keep all sections below the hero (stats bar, features, how-it-works, notice, footer) structurally unchanged — only minor spacing/divider tweaks if needed for rhythm.

3. Ensure all `data-ocid` markers are preserved.
