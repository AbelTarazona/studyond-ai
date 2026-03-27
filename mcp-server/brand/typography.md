# Typography

## Fonts

| Role | Font | Fallback |
|------|------|----------|
| **Headlines (website)** | Crimson Text (serif, 400/600/700) | `ui-serif, Georgia, serif` |
| **Body / UI (app)** | Avenir Next, system stack | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto` |
| **Body / UI (website)** | Geist Variable (sans-serif) | `ui-sans-serif, system-ui, sans-serif` |

**Rule:** Serif is reserved for display-layer hero titles only. Everything else uses sans-serif.

For the hackathon, use the system font stack — no need to load custom fonts.

**CSS:** Font stack and all type scale classes are in [`app.css`](app.css)

## Type Scale

| Class | Size | Weight | Line Height | Use |
|-------|------|--------|-------------|-----|
| `.ds-caption` | 12px | 400 | 16px | Fine print, timestamps |
| `.ds-badge` | 12px | 500 | 16px | Badge labels |
| `.ds-label` | 14px | 500 | 20px | Form labels, metadata |
| `.ds-small` | 14px | 400 | 20px | Secondary body text |
| `.ds-body` | 16px | 400 | 24px | Primary body text |
| `.ds-title-cards` | 18px | 500 | 24px | Card titles |
| `.ds-title-sm` | 20px | 500 | 28px | Small headings |
| `.ds-title-md` | 24px | 500 | 32px | Section headings |
| `.ds-title-lg` | 30px | 500 | 36px | Page titles |
| `.ds-title-xl` | 36px | 500 | 40px | Hero titles |

## Responsive Header Utilities

`.header-xl`, `.header-lg`, `.header-md`, `.header-sm` — defined in [`app.css`](app.css)
