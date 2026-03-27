---
tags:
  - platform
  - entity
---

# Thesis Project Lifecycle

The Thesis Project Lifecycle defines the states a [[Thesis Projects|thesis project]] moves through on the Studyond platform. It tracks the collaboration from initial interest through final submission, governing how [[Students]], [[Companies]], and [[Supervisors]] interact.

## States

- **proposed** -- student has drafted a proposal, not yet submitted
- **applied** -- proposal submitted to company or supervisor for review
- **agreed** -- both sides confirmed the collaboration; project begins
- **in_progress** -- active thesis work underway
- **completed** -- thesis finished and submitted

## Transition Paths

The primary happy path follows: `proposed` -> `applied` -> `agreed` -> `in_progress` -> `completed`.

Additional transitions handle non-happy paths:

- **withdrawn** -- student withdraws their application (from `applied`)
- **rejected** -- company or supervisor declines the proposal (from `applied`)
- **canceled** -- project is canceled after agreement was reached (from `agreed` or `in_progress`)

## Project-First Model

[[Thesis Projects]] can exist before a topic is assigned (`topicId: null`). This supports the [[Context Accumulation]] principle -- a project starts as a student's intent and progressively fills in topic, company, supervisors, and experts as the collaboration takes shape.

## Platform Role

The lifecycle is the backbone of collaboration on the platform. It determines what actions are available to each party at each stage, drives notification triggers, and provides the structured outcome data that [[Universities]] use for accreditation reporting. The mock data includes 15 sample projects at various lifecycle stages.

## Related

See [[Thesis Projects]] for the entity definition, [[Application Management]] for how applications feed into this lifecycle, and [[Data Model]] for the full entity relationship structure.
