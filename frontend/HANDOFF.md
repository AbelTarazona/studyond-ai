# What's Done

- Full project scaffolded (React + Vite + TypeScript + Tailwind)
- Intake form (`src/components/intake/IntakeForm.tsx`) — working
- Journey map (`src/components/journey/JourneyMap.tsx`) — working, renders stages
- "I'm stuck" dialog (`src/components/stuck/StuckDialog.tsx`) — UI done, AI call done
- Outreach dialog (`src/components/outreach/OutreachDialog.tsx`) — UI done, AI call done
- Match section (`src/components/match/MatchSection.tsx`) — working
- Zustand store (`src/store/journeyStore.ts`) — has localStorage persist built in already
- All prompts in `src/lib/prompts.ts`
- All UI copy in `src/lib/copy.ts`

---

## Your Tasks This Shift

### Task 1 — ActionCard component

**File to create:** `src/components/journey/ActionCard.tsx`

This card appears inside the active stage card in `JourneyMap.tsx`. It calls the AI and shows the student their next concrete action.

**Props it receives:**
```typescript
interface ActionCardProps {
  stage: string       // e.g. "orientation"
  topic: string
  university: string
  deadline: string
  weeksLeft: number
  urgency: 'calm' | 'moderate' | 'urgent'
}
```

**How to call the AI:**
Use `ACTION_CARD_PROMPT` from `src/lib/prompts.ts` and `SYSTEM_PROMPT_BASE`.
Same fetch pattern as `StuckDialog.tsx` — copy that pattern exactly.

**What it should render:**
- A subtle card with `border-ai` class and light background
- Label: "What to do right now" (use `.text-ai` class for the label)
- The AI response text below it
- A loading skeleton while it fetches
- Show the card only when the AI has responded

**Then wire it into `JourneyMap.tsx`:**
Import ActionCard and render it inside the active stage's card, below the description and above the action buttons.

---

### Task 2 — Fix localStorage persistence check

In `src/store/journeyStore.ts` the persist middleware is already set up.
Just verify it works by:
1. Running the app locally (`npm run dev`)
2. Completing the intake form
3. Refreshing the page — the journey map should still be there, not the intake form
4. If it resets, check the `name` key in the persist config matches

---

### Task 3 — Deadline urgency in JourneyMap

In `src/components/journey/JourneyMap.tsx`, the `urgency` variable is already calculated.
Add this: when urgency is `'urgent'`, collapse all stages that are `not_started` into a single line ("X stages remaining — focus on what's in front of you") instead of showing them all expanded.

---

## Don't Touch

- `src/lib/prompts.ts` -
- `src/lib/copy.ts` -
- `src/data/` -

## To Run Locally

```bash
npm install
cp .env.example .env
# add your API key to .env
npm run dev
```

---

## When You're Done

Open a PR titled `feat: action-card + persistence` and leave a comment on anything you weren't sure about.
Don't merge — lead dev will review when back online.
