# Setup

## Tech Stack

| Layer | Tool | Notes |
|-------|------|-------|
| **Framework** | React 19 + TypeScript | Vite recommended |
| **Styling** | Tailwind CSS v4 | With `@tailwindcss/vite` plugin |
| **Components** | shadcn/ui (new-york style) | Headless components styled with CVA |
| **AI** | Vercel AI SDK | Streaming chat with tool use |
| **Icons** | Lucide React / Tabler Icons | 16px default size |
| **State** | Zustand | Lightweight stores |
| **Forms** | React Hook Form + Zod | Validation |
| **Animations** | Framer Motion | Optional — keep subtle |
| **Editor** | TipTap | Rich text |
| **Auth** | Auth0 | Authentication |
| **i18n** | i18next | English + German |

## Install

**Script:** [`setup.sh`](setup.sh)

## shadcn Configuration

**Config:** [`components.json`](components.json)

## Next Steps

1. Copy [`app.css`](app.css) into your `src/App.css`
2. Review the type scale in [`typography.md`](typography.md)
3. Start building with components from [`components.md`](components.md)
