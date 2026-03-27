---
tags:
  - entity
---

# Thesis Projects

Thesis Projects are the core collaboration entity on Studyond. A thesis project links a [[Students|student]] with a [[Topics|topic]], [[Companies|company]], and [[Supervisors|supervisor(s)]] into a single structured collaboration.

## Key Properties

- **Title and description** -- what the thesis is about
- **Motivation** -- why the student wants to work on this (may be null for early-stage projects)
- **Student** -- the [[Students|student]] working on it
- **Topic** -- the [[Topics|topic]] being addressed (can be null in the project-first model)
- **Company** -- the [[Companies|company]] involved (from the topic, if any)
- **University** -- the [[Universities|university]] of the student or topic
- **Supervisors** -- [[Supervisors]] providing academic oversight
- **Experts** -- [[Experts]] from the company side
- **State** -- current position in the [[Thesis Project Lifecycle]]
- **Timestamps** -- `createdAt` and `updatedAt` for tracking

## Project-First Model

A thesis project can exist before a topic is assigned (`topicId: null`). This supports the [[Context Accumulation]] principle: a project starts as a student's intent and progressively fills in topic, company, supervisors, and experts as the collaboration takes shape. Both `companyId` and `universityId` can be present simultaneously when a company topic is supervised by university faculty.

## Lifecycle

Projects follow the [[Thesis Project Lifecycle]]: `proposed` -> `applied` -> `agreed` -> `in_progress` -> `completed`, with alternative paths for withdrawal, rejection, and cancellation.

## Mock Data

The mock data includes 15 sample projects at various lifecycle stages, demonstrating the full range of states and entity relationships. See [[Data Model]] for TypeScript type definitions.

## Related

See [[Thesis Journey]] for the student experience perspective, [[Application Management]] for how applications create projects, and [[Thesis-to-Hire Pipeline]] for how completed projects lead to employment.
