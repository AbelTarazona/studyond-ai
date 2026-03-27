---
name: brand-review
description: Review code for Studyond brand compliance — checks colors, typography, layout, components, and animation against the design system.
---

## Instructions

1. Read the brand guidelines:
   - `brand/README.md` (design philosophy, do's and don'ts)
   - `brand/app.css` (all design tokens and utility classes)
   - `brand/components.md` (layout rules, component specs, animation rules)

2. Identify the files to review:
   - If the user specifies files, review those
   - Otherwise, find all `.tsx`, `.jsx`, and `.css` files in `src/`

3. Check each file against these rules:

### Colors
- Uses semantic tokens (`bg-primary`, `text-muted-foreground`), not raw colors (`#fff`, `blue-500`)
- No decorative color usage — color only for meaning (status, type badges, AI accent)
- AI gradient classes (`.text-ai`, `.bg-ai`) used only for AI-specific features

### Typography
- Uses design system classes (`ds-body`, `ds-title-md`, `header-xl`) or equivalent Tailwind
- No serif fonts for body/UI text (serif is display-only)
- No more than one hero/display title per page

### Layout
- Uses grid system classes (`grid-3-col`, `grid-4-col`) or equivalent responsive grids
- Content constrained with `ds-layout-narrow` or `ds-layout-onboarding` where appropriate
- Consistent spacing rhythm

### Components
- Buttons are fully rounded
- Cards have no static shadows (shadow only on hover via `shadow-lg`)
- Image cards use 4:5 portrait or 3:2 landscape aspect ratios
- Using shadcn/ui components as base, not custom implementations

### Animation
- Timing: 150ms micro, 200ms deliberate, 300ms standard, 500ms slow
- No bounce, elastic, or overshoot easing
- Card hover: `scale(1.05)` image zoom + title color shift
- Uses Tailwind transition utilities (`transition-colors`, `transition-transform`)

### Border Radius
- Uses token scale (`rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`), not raw values

4. Report findings grouped by category with file:line references
5. Suggest specific fixes for each issue
