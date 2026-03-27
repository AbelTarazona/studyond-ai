---
tags:
  - brand
---

# Component Guidelines

Key UI patterns that implement [[Editorial Minimalism]] principles across the Studyond platform. These components use the [[Typography]] scale and [[Color System]] tokens as their foundation.

## Buttons

All buttons are **fully rounded** — this is a core brand element. Variants: default (dark background, light text), secondary (light gray background), outline (border, transparent background), ghost (no background, hover reveals it), link (text only, color change on hover), and destructive (red background, errors/danger only). Sizes: small (header buttons, compact UI), default (standard), large (hero CTAs).

## Cards

Standard border radius ~10px. Shadow appears only on hover, never static. Three main types:

- **InsightCard** — Image with 4:5 portrait aspect ratio, gradient overlay, type badge top-left, avatar(s) bottom-right. Below: "Author · Date" metadata then card title (2-line clamp).
- **Featured** — Landscape 3:2 aspect ratio, larger radius, larger title, abstract text below.
- **Compact** — Text-only with metadata + title + border separator. For dense listings.

**Hover behavior:** Image scales to 1.05x, title shifts to primary color. That is the full hover treatment.

## Layout

The **3+9 editorial grid** is the signature layout: 3-column margin (section labels, table of contents, sticky wayfinding) plus 9-column content. Gap: 2.5rem. Activates at the lg breakpoint (1024px); stacks to single column on mobile. Max container width: 1360px, centered.

**Card grid:** Responsive from 1 column (mobile) to 2 (sm/640px) to 3 (lg/1024px) to 4 (xl/1280px).

**Section spacing:** Standard 48-96px between major sections. Small 24-48px for card grids and compact sections.

## Icons

Tabler Icons (website) / Lucide React (app). Standard size: 16px. Common: chevrons for navigation, arrows for CTAs, X for close.

## Responsive Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | < 768px | Single column, hamburger nav, stacked layout |
| sm | 640px | 2-column card grids |
| md | 768px | Wider typography |
| lg | 1024px | 3+9 grid activates, desktop nav, 3-column cards |
| xl | 1280px | 4-column cards, increased container padding |

See `brand/components.md` for full specs and example code.
