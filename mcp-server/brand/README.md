# Brand & UI Reference

Everything you need to reproduce the Studyond look and feel.

## Design Philosophy

**Editorial minimalism** — monochrome palette, generous whitespace, magazine-like typographic hierarchy.

1. **Content first** — UI fades into background; typography and images carry the page
2. **Quiet confidence** — no flashy gradients or neon accents; authority from restraint
3. **Functional color** — color means something (type badges, status); never decorative
4. **Consistent rhythm** — same spacing and grid cadence across pages
5. **Progressive disclosure** — subtle hover states reveal more; nothing screams for attention

## Files

| File | What's inside |
|------|--------------|
| [`setup.md`](setup.md) | Tech stack, install commands, shadcn config |
| [`colors.md`](colors.md) | Color system reference (hex table, AI accent docs) |
| [`typography.md`](typography.md) | Font stack, type scale, header utilities |
| [`components.md`](components.md) | Layout, components, icons, animation |
| [`ai-integration.md`](ai-integration.md) | Vercel AI SDK setup, AI visual style classes |
| [`image-generation.md`](image-generation.md) | Generate brand-consistent images with Gemini |

## Ready-to-Use Files

| File | What |
|------|------|
| [`app.css`](app.css) | Complete design system CSS — paste into `src/App.css` |
| [`components.json`](components.json) | shadcn/ui configuration |
| [`setup.sh`](setup.sh) | Project setup script |
| [`studyond.svg`](studyond.svg) | Studyond logo |
| [`examples/`](examples/) | TSX examples — AI chat, cards, badges, icons |

## Claude Code Skills

See [`/skills`](../skills/) — copy to `~/.claude/skills/` to get slash commands for project setup, component scaffolding, brand review, and image generation.

## Do's and Don'ts

### Do

- Use semantic color tokens (`bg-primary`, `text-muted-foreground`) — not raw colors
- Use fully rounded buttons always
- Use the type scale classes (`ds-title-md`, `ds-body`, etc.)
- Keep the monochrome foundation — color only for meaning
- Use shadcn components as your base — customize via variants
- Keep hover animations at 300ms with simple transforms
- Use the AI gradient for AI-specific features only

### Don't

- Use color decoratively (no gradient backgrounds, no colorful sections)
- Use shadows on static elements (only on hover)
- Use serif fonts for body text or UI elements (serif is display-only)
- Add bounce or elastic easing
- Use more than one hero/display title per page
- Create new color tokens — use the existing semantic palette
- Use raw border-radius values — use the token scale

## Source-of-Truth Files

If you have access to the Studyond repositories:

| Resource | Location |
|----------|----------|
| App CSS tokens & variables | `studyond-app/src/App.css` |
| App typography scale | `studyond-app/src/styles/typography.css` |
| App component utilities | `studyond-app/src/styles/components.css` |
| App shadcn config | `studyond-app/components.json` |
| Website design master doc | `studyond-web-seo/design-system/MASTER.md` |
| Website CSS tokens | `studyond-web-seo/src/styles/shadcn.css` |
| Brand voice & tone | This repo: `context/brand.md` |
