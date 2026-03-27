---
tags:
  - platform
---

# Tech Stack

Studyond is built as a modern React single-page application with AI capabilities integrated at the product level. The stack prioritizes fast iteration, type safety, and a polished UI.

## Frontend

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 with shadcn/ui components (new-york style) and Radix UI primitives
- **Icons:** Tabler Icons
- **State management:** Zustand (lightweight, minimal boilerplate)
- **Forms:** React Hook Form + Zod for validation
- **Animation:** Framer Motion
- **Rich text editing:** TipTap
- **Internationalization:** i18next (English + German)

## AI

- **SDK:** Vercel AI SDK with streaming chat and tool use
- **Model provider:** Anthropic
- **Features:** The [[Student AI Agent]] and [[Expert AI Agent]] use streaming responses with visible reasoning. Students can toggle between "Fast" and "Thinking" modes for quick answers vs. deeper reasoning.

## Authentication

- **Auth provider:** Auth0

## Design System

The brand and component system is documented in the `brand/` folder. See [[AI Visual Language]] for AI-specific styling patterns, [[Color System]] for the palette, [[Typography]] for type scales, and [[Component Guidelines]] for UI component conventions.

## Mock Data

Mock data uses human-readable IDs and TypeScript type definitions in `mock-data/types.ts`. See [[Data Model]] for entity structure.
