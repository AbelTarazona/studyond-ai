---
tags:
  - platform
---

# Student AI Agent

The Student AI Agent is Studyond's conversational AI feature for [[Students]]. It helps students discover relevant [[Topics]] through natural-language dialogue, powered by the Vercel AI SDK with Anthropic models.

## What It Does

The agent understands the student's profile -- including [[Study Programs|study program]], degree level, [[Fields|fields]] of interest, skills, and objectives. It suggests personalized thesis topics with reasoning, linking directly to real topics from real [[Companies]]. Conversations persist across sessions (stored locally), and students can toggle between "Fast" and "Thinking" modes for quick answers vs. deeper reasoning with visible chain-of-thought.

## How It Works

The agent operates as a chat-based interface on the student dashboard. Students describe their interests in natural language, receive AI-generated suggestions with explanations, and click through to actual topics. The [[Matching Engine]] powers the underlying topic recommendations.

## Current Limitations

The Student AI Agent is currently limited to topic discovery. It does not support:

- Planning, execution, or thesis progress tracking
- [[Context Accumulation]] across independent conversations
- Autonomous proactive suggestions without being asked
- Cross-entity recommendations (e.g., suggesting [[Supervisors]], [[Interview Partners]], or [[Methodology]])
- Milestone tracking or timeline awareness

Expanding these capabilities is a key part of the [[Opportunity Space]]. The agent could evolve from a topic discovery tool into a comprehensive thesis companion that supports the full [[Thesis Journey]].

## Related

See [[Expert AI Agent]] for the company-side equivalent and [[Tech Stack]] for implementation details.
