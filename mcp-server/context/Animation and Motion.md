---
tags:
  - brand
---

# Animation and Motion

Studyond's motion language is smooth, measured, and minimal — consistent with [[Editorial Minimalism]]. Every animation serves a functional purpose: confirming interaction, revealing information, or guiding attention.

## Timing Scale

| Duration | Use |
|----------|-----|
| 150ms | Micro-interactions — button hover, nav link color change |
| 200ms | Deliberate transitions — dropdown open, chevron rotation |
| 300ms | **Standard** — card hover, avatar expand, badge morphs |
| 500ms | Slow transitions — logo bar rotation, crossfade |

## Common Patterns

**Card hover:** Image zooms slightly (scale 1.05x), title shifts to primary color. That is the complete card hover treatment — nothing more.

**Button:** Background opacity shifts on hover. Minimal.

**Links:** Color change to primary. No underline animation.

**Dropdown chevron:** 180-degree rotation on open/close.

**Mobile menu:** Slide from left.

**Logo bar:** Crossfade between logo sets.

## Content Type Badge Animations

Content type indicators use monochrome geometric animations on hover, all CSS, 300ms duration:

- **Spotlight:** Second dot scales up behind the main dot (halo effect)
- **Voice:** Message icon fades in over the dot
- **Outcome:** Ring expands around the dot
- **Product Update:** Dot rises, trail dot appears below
- **Event:** Dot splits into two side by side
- **Press:** Two wave arcs radiate from the dot
- **Announcement:** Chevron extends from the dot

## Philosophy

No bounce, no elastic, no overshoot. Everything is smooth and linear. Shadows appear only on hover, never on static elements. Respect `prefers-reduced-motion`. See [[Component Guidelines]] for how these timing values apply to specific UI elements.
