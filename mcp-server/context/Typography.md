---
tags:
  - brand
---

# Typography

Studyond uses two font families in a strict hierarchy: serif for display headlines only, sans-serif for everything else. This separation is a core part of the [[Editorial Minimalism]] identity.

## Font Families

| Role | Font | Fallback |
|------|------|----------|
| **Display headlines** | Crimson Text (serif) | Georgia, serif |
| **Body and UI** | Geist Variable (sans-serif) | system-ui, sans-serif |

## Type Scale

### Display Layer — Hero Moments

Serif display titles for marketing hero sections. **Maximum one "display" per page.** Display ranges from 3rem to 5rem (line-height 1.0). Headline ranges from 2.25rem to 3.75rem. These are the only places serif appears.

### Title Layer — Section Headings

Sans-serif headings for sections, cards, and page headers. Title: 1.5rem to 2.25rem (line-height 1.2). Title small: 1.25rem to 1.875rem. These are the workhorse headings throughout the platform.

### Body Layer — Readable Content

- **Subtitle:** 17px / 18px (large) — hero subtitles, section intros, CTA descriptions
- **Body:** 15px — standard descriptions, bios, card abstracts, sidebar text, footer links
- **Caption:** 12px — fine print, footer legal/copyright text

### Card Title

Medium weight, 2-line clamp, color shift on hover. Used for interactive card headings throughout content listings.

### Labels and Metadata

- **Label:** 12px, medium weight, tracked — card metadata (dates, authors), sentence case
- **Label upper:** 12px, medium weight, uppercase — section divider labels, margin column labels, step numbers
- **Nav heading:** 14px, semibold — footer column headings, navigation group titles

### Metadata Formatting

Card metadata follows a strict pattern: **Author · Date** (middle dot separator). Both in label style, muted color. Date formatted like "Jan 21, 2026."

## Key Rules

Never use serif for body text or small headings. Always use semantic heading tags (h1, h2, h3) in logical order for accessibility. Type styles are named for their role, not their size. Color is applied independently from typography. See [[Component Guidelines]] for how these type styles map to UI patterns, and `brand/typography.md` for the full CSS class reference.
