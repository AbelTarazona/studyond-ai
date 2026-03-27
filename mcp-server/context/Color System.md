---
tags:
  - brand
---

# Color System

Studyond's color system is monochrome by default with semantic accents, built on the OKLCH color space. Color is never decorative — it always carries meaning.

## Foundation

### Light Mode

White backgrounds, near-black foreground text, light gray secondary surfaces. Primary buttons and active states use very dark gray with off-white text. Muted foreground (medium gray) handles metadata, labels, and secondary body text. Borders are light gray for dividers and card edges. Destructive red appears for error states only.

### Dark Mode

Automatic inversion via design tokens: backgrounds go dark, text goes light, borders become semi-transparent white, entity badges swap to dark color variants, logos get inverted. Card overlays remain unchanged (dark gradients on dark images). Selection color shifts from warm yellow to muted gold.

## Accent: Text Selection

- **Light mode:** Warm yellow highlight
- **Dark mode:** Muted gold highlight

## Where Color Is Allowed

Color is used ONLY for:

- **Entity type badges** — people, organizations, and audience types use colored badge styles (greens, blues, etc.)
- **Status indicators** — active, pending, error states
- **AI features** — purple-blue gradient accent distinguishes AI-powered elements (see [[AI Visual Language]])

## Content Type Indicators

Content types are differentiated by **monochrome geometric animation**, not color. Each type has a unique dot animation on hover: Spotlight gets a halo, Voice gets a message icon, Outcome gets an expanding ring, Product Update gets a rising trail dot, Event gets a splitting dot, Press gets radiating wave arcs, and Announcement gets an extending chevron. All CSS, 300ms duration.

## What to Reference

The full CSS variable set is defined in `brand/colors.md` and `app.css`. See [[Editorial Minimalism]] for the design philosophy that drives the monochrome-first approach.
