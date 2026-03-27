---
tags:
  - brand
  - platform
---

# AI Visual Language

AI-powered features in Studyond use a distinct purple-blue gradient accent that separates them from the monochrome base of the [[Color System]]. This gradient is the only non-monochrome, non-badge color in the system — and it must only appear on genuinely AI-powered features, never as decoration.

## CSS Utilities

| Class | Effect | Use |
|-------|--------|-----|
| `.text-ai` | Gradient text (purple-to-blue) | AI badges, AI-powered labels |
| `.bg-ai` | Gradient background | AI feature cards, AI action buttons |
| `.text-ai-solid` | Solid purple text | Simpler AI indicators |
| `.border-ai` | Gradient border | AI-powered containers, input fields |

## Where to Use

- **AI badges** — marking features powered by the [[Student AI Agent]] or [[Expert AI Agent]]
- **AI-powered buttons** — actions that trigger AI processing (e.g., "Find matching topics," "Generate suggestions")
- **AI feature cards** — cards that showcase or contain AI-driven content
- **The [[Matching Engine]]** interface — where AI recommendations are surfaced

## Where NOT to Use

The AI gradient should never appear on standard UI elements. If a feature does not involve AI processing, it gets the standard monochrome treatment. Misusing the gradient dilutes its signal value.

## Tech Integration

The Vercel AI SDK powers the chat and streaming interfaces:

- **Server route:** POST `/api/chat` with the Anthropic provider
- **Client component:** `useChat` hook for streaming responses

See [[Tech Stack]] for the full technical architecture. The visual styling (CSS utilities above) and the technical integration (AI SDK) work together — the gradient signals to users that they are interacting with an AI-powered feature.
