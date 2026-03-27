# Color System

Monochrome by default. Built on OKLCH color space.

**CSS:** [`app.css`](app.css) — contains all theme variables, light/dark modes, and base layer styles.

## Quick Reference (Approximate Hex)

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `background` | `#FFFFFF` | `#1A1A1A` | Page background |
| `foreground` | `#1A1A1A` | `#FBFBFB` | Primary text |
| `primary` | `#2B2B2B` | `#ECECEC` | Buttons, active states |
| `primary-foreground` | `#FBFBFB` | `#2B2B2B` | Text on primary |
| `secondary` | `#F5F5F5` | `#3D3D3D` | Secondary surfaces |
| `muted` | `#F5F5F5` | `#3D3D3D` | Muted backgrounds |
| `muted-foreground` | `#808080` | `#B3B3B3` | Labels, metadata |
| `border` | `#ECECEC` | `white/10%` | Dividers |
| `destructive` | `#E63946` | `#FF6B7A` | Error states |

## AI Accent

AI-related features use a purple-blue gradient to distinguish them from standard UI.

**CSS:** `.text-ai`, `.bg-ai`, `.text-ai-solid`, `.border-ai` classes in [`app.css`](app.css)

**Usage examples:** [`examples/CardExample.tsx`](examples/CardExample.tsx) — see `AiAccentExamples`
