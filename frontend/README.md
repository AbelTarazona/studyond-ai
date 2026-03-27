# 🧭 Thesis GPS

> An AI-powered single-page map for your thesis. Drop in your situation, get a live route, and never feel lost again.

Built for **START Hack 2026 — Studyond challenge**.

---

## Why it matters

- Thesis workflows are non-linear; students oscillate between ideation, supervision, applications, execution, writing, and job hunting. Thesis GPS keeps every phase visible in one viewport.
- AI copilots are embedded where they are needed: next-step reasoning inside each stage, plus a real-time “I’m stuck” escalation that speaks the student’s context.
- The app treats the thesis journey like logistics. We combine urgency scoring, geo-like mapping, and recommendation systems to show the single best move right now.

---

## Product walkthrough

1. **Intake** – Students answer four prompts (topic, school/company context, fields, deadline). We persist the data with Zustand to keep the session alive.
2. **Journey Map** – A contour map inspired canvas (Framer Motion) renders the eight canonical stages with animated progress, urgency meter, and contextual copy from `STAGES`.
3. **Stage Workspace** – Clicking a node swaps in the correct workspace module:
   - *Orientation*: research-question sandbox, instant topic scoring, employment signals.
   - *Supervisor*: overlap-based advisor + expert matching using `fieldOverlapScore` and mock people data.
   - *Application*: AI compares company vs university tracks, surfaces best-fit tracks, and explains why.
   - *Planning → Submission*: Planner board auto-populates stage checklists and color-codes todo/in-progress/done states.
4. **Action Cards & AI** – For the active stage we generate an AI “next action” brief (ActionCard) plus a `StuckDialog` that uses the Anthropic key + `STUCK_PROMPT` to triage blockers.
5. **Outreach Flows** – Match insights plug into outreach/email helpers so students can jump from insight to motion.

---

## Feature highlights

- **Live thesis atlas** – Animated map, urgency forecast, and completion percentage keep the journey legible at a glance.
- **Stage-aware workspace** – Orientation, Supervisor, Application, Writing, and Planner modes each expose the tools that matter for that moment (topic scoring, matcher, application comparer, writing checklist, etc.).
- **Dual recommendation engines** – `useMatches` handles overlap scoring for supervisors/experts; `useRecommendations` ranks topics, projects, experts, and job paths depending on the selected stage.
- **AI escalation loop** – ActionCard supplies proactive nudges, while Stuck Dialog turns blockers into Anthropic-powered diagnoses with Markdown responses.
- **Operating system for planning** – Stage tasks feed a lightweight planner board so students can tick progress without leaving the workspace.
- **All-local mock graph** – `src/data` ships topics, projects, supervisors, experts, and universities so the experience demos without external services.

---

## Architecture at a glance

| Layer | What it covers |
| --- | --- |
| **UI** | React 19 + Vite + Tailwind v4 preview classes, Lucide icons, Framer Motion animations, custom design-system typography classes (`ds-*`). |
| **State** | `useJourneyStore` (Zustand + localStorage) holds intake data, stage states, and completion flags so the session survives refreshes. |
| **Recommendations** | Pure hooks (`useMatches`, `useRecommendations`) operate on local datasets; scoring formulas are documented inline and memoized for performance. |
| **AI** | Anthropic-powered helpers live in `lib/studyond.ts` and `lib/prompts.ts`. The Stuck dialog composes prompts with stage context and student blockers. |
| **Data** | Mock JSON + helper functions in `src/data` (fields, topics, projects, universities, experts, supervisors). |

---

## Tech stack

- **Frontend**: React 19, Vite 5, TypeScript, Tailwind 4 utility classes, Framer Motion, Lucide.
- **State & data**: Zustand (persist), custom hooks, typed mock datasets.
- **AI & tooling**: Anthropic via `ai` SDK, LangChain experimental agents, Vercel Analytics.
- **Quality**: TypeScript strict mode, ESLint 9, module path aliases via `tsconfig.json`.

---

## Getting started

```bash
# Clone and install
git clone <your-repo-url>
cd thesis-gps
npm install

# Add your Anthropic API key (required for AI prompts)
cp .env.example .env
echo "VITE_ANTHROPIC_API_KEY=your_key_here" >> .env

# Run the dev server
npm run dev
```

Open http://localhost:5173 

Open our website https://andalusiathesisgps.vercel.app/ to explore the live journey.

---

## Repo layout

```
src/
  components/
    intake/       # Intake form (stage, topic, university, deadline)
    journey/      # Visual map, workspace modules, action cards
    stuck/        # "I'm Stuck" dialog + AI conversation
    match/        # Supervisor/expert match cards
    outreach/     # Outreach + email generators
    landing/      # Marketing-ish home hero
    ui/           # Shared UI primitives / DS helpers
  data/           # Mock data (supervisors, experts, topics, fields)
  hooks/          # useJourneyStore, useMatches, useRecommendations, etc.
  lib/            # utils, copy decks, AI client, scoring logic
  store/          # Zustand store + persistence config
```

---

## Next ideas

- Plug the recommendation hooks into real Studyond endpoints.
- Extend planner items into a mini Kanban with drag-n-drop.
- Allow exporting AI insights + plan into Notion / email digest.
