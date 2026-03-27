# Components, Layout & Animation

**CSS:** All layout classes are in [`app.css`](app.css)
**Examples:** [`examples/CardExample.tsx`](examples/CardExample.tsx)

## Layout

### Grid Systems

`.grid-3-col` — responsive 3-column grid (1 col mobile, 2 col tablet, 3 col desktop)
`.grid-4-col` — responsive 4-column grid (1 col mobile, 2 col tablet, 3 col desktop, 4 col xl)

### App Layout Pattern

`.header` — sticky header with flex layout
`.scroll-area` / `.scroll-area-content` — full-height scroll container with padding

### Content Width

`.ds-layout-narrow` — max-width for forms
`.ds-layout-onboarding` — max-width for split layouts

### Responsive Breakpoints

| Name | Width | Key change |
|------|-------|------------|
| (base) | < 640px | Single column, stacked |
| `sm` | 640px | 2-column grids |
| `md` | 768px | Wider typography |
| `lg` | 1024px | 3-column grids, desktop nav |
| `xl` | 1280px | 4-column grids |

---

## Border Radius

| Token | Size | Use |
|-------|------|-----|
| `--radius` | 10px | Base (cards, containers) |
| `--radius-sm` | 6px | Small elements |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 10px | Standard cards |
| `--radius-xl` | 14px | Large cards |

---

## Buttons

shadcn/ui button with CVA. Always fully rounded.

| Variant | Style | Use |
|---------|-------|-----|
| `default` | Dark bg, white text | Primary CTAs |
| `secondary` | Light gray bg | Secondary actions |
| `outline` | Border, white bg | Tertiary actions |
| `ghost` | Transparent, hover bg | Nav items, inline |
| `link` | Text only | Inline links |
| `destructive` | Red bg | Danger actions |

| Size | Style | Use |
|------|-------|-----|
| `default` | `h-9 px-4 py-2` | Standard |
| `sm` | `h-8 px-3` | Compact UI |
| `lg` | `h-10 px-6` | Hero CTAs |
| `icon` | `size-9` | Icon-only |

---

## Cards

- Standard radius: `rounded-lg` (~10px)
- No shadow by default — shadow only on hover
- Hover: `shadow-lg` + title color shift
- Image cards: 4:5 portrait aspect ratio
- Featured cards: 3:2 landscape

**Example:** `ImageCard` in [`examples/CardExample.tsx`](examples/CardExample.tsx)

---

## Dialogs / Sheets

Dialog overlay style (subtle blur, no heavy darkening) is in [`app.css`](app.css).

---

## Sidebar

Use shadcn's sidebar component. Studyond uses a collapsible sidebar with:
- Logo at top
- Navigation items with icons
- Sidebar extensions for contextual panels
- Mobile: sheet-based overlay

---

## Badges

**Example:** `BadgeExamples` in [`examples/CardExample.tsx`](examples/CardExample.tsx)

---

## Icons

**Primary:** Lucide React (in app), Tabler Icons (in website)

| Size | Use |
|------|-----|
| 12px (`size-3`) | Tiny indicators |
| 16px (`size-4`) | Standard — buttons, nav, metadata |
| 20px (`size-5`) | Slightly larger |
| 24px (`size-6`) | Mobile menu, prominent actions |

**Example:** `IconExamples` in [`examples/CardExample.tsx`](examples/CardExample.tsx)

---

## Animation

### Timing

| Duration | Use |
|----------|-----|
| 150ms | Micro-interactions (button hover, color change) |
| 200ms | Deliberate transitions (dropdown, chevron) |
| 300ms | Standard — card hover, avatar expand |
| 500ms | Slow transitions (crossfade) |

### Rules

- **No bounce, no elastic, no overshoot** — everything smooth and measured
- Shadows only on hover, never static
- Card hover: image zoom `scale(1.05)` + title color shift
- Use `transition-colors`, `transition-transform`, `transition-all` Tailwind utilities
- Respect `prefers-reduced-motion`
