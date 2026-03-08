# RailMutual Connect

## Current State

The landing page (`LandingPage.tsx`) exists with all sections: Header, Hero, Stats Bar, Feature Cards (Why Choose), How It Works, Important Notice, and Footer. The page has basic styling using Tailwind and some inline styles. The header has a logo with a white background box around the icon and two action buttons. The hero uses a cinematic background image with navy gradient overlay. The footer contains a "Built with caffeine.ai" line that needs removal. The How It Works section uses a 3-column grid on desktop but the step circles and connectors could be stronger.

## Requested Changes (Diff)

### Add
- Hamburger mobile menu to the landing page header (the LandingPage header, not Layout.tsx)
- Sticky landing page header with proper z-index
- Visual arrow connectors between How It Works steps on desktop
- Stat item icons (small, subtle) next to each stat number
- New hero background image: `/assets/generated/hero-railway-v2.dim_1920x1080.jpg`

### Modify
- **Header**: Height 64–72px. Gradient background `#0B2C4A → #12395F`. Left side: icon (50px white square container, icon fills ~78% of it) + "RailMutual Connect" bold text + tagline "Mutual Transfers Made Easy" below. Right side: Login (transparent, white border, white text) + Create Profile (orange #F97316, white text, rounded-lg, slightly larger). Gap 12px between buttons. Padding 20px left/right. All elements vertically centered. Sticky. Mobile-responsive with hamburger menu for small screens.
- **Hero section**: Use new image `/assets/generated/hero-railway-v2.dim_1920x1080.jpg`. Stronger dark navy overlay (heavier `#0B2C4A` gradient). Increase headline to `text-4xl sm:text-5xl lg:text-6xl xl:text-7xl`. "Mutual Transfer" highlighted in `#F97316`. Better vertical spacing between logo block, headline, description, CTA buttons. CTA buttons: "Create Profile" is primary (`#F97316`, white text, rounded-full, shadow), "Login" is secondary (transparent, white border). Both buttons large, properly spaced.
- **Stats Bar**: Larger numbers (`text-3xl sm:text-4xl` font weight bold). Add a relevant small icon per stat (Train, Map, BadgeCheck, ListChecks from lucide). Improve spacing and dividers between stats.
- **Feature Cards**: Already have soft shadow and rounded corners — enhance with larger padding (`p-8`), improve icon container size, ensure consistent gap between cards, add hover lift effect.
- **How It Works**: Keep horizontal 3-column layout on desktop. Replace dashed line with a more visible arrow connector. Step circles stay orange with white number. Better spacing.
- **Important Notice**: Display in a highlighted light beige (`bg-amber-50`) container with clear border (`border border-amber-200`), improved padding (`py-12 px-8`), rounded-xl.
- **Footer**: Remove "Built with ❤️ using caffeine.ai" text entirely. Keep: logo icon + "RailMutual Connect" text + tagline + contact email + copyright line only.

### Remove
- White square background wrapper around icon in header (replace with clean white square container per spec: ~50px with icon filling 78%)
- "Built with ❤️ using caffeine.ai" text from landing page footer
- Any "Admin" button from the landing page header

## Implementation Plan

1. Update `LandingPage.tsx`:
   - Redesign header with sticky positioning, gradient background, proper flex layout, correct button styles, hamburger menu state for mobile
   - Update hero section: new background image, stronger overlay, larger headline, better spacing, button redesign
   - Upgrade stats bar: larger numbers, lucide icons, better spacing
   - Improve feature cards: more padding, consistent spacing
   - Improve How It Works: stronger arrow connector on desktop
   - Restyle Important Notice: amber-50 background, proper padding, rounded container
   - Clean up footer: remove caffeine.ai attribution, keep only logo + tagline + email + copyright
   - Ensure all sections are mobile-responsive
   - Add `data-ocid` deterministic markers to all interactive elements
