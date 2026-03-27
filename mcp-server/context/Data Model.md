---
tags:
  - platform
  - entity
---

# Data Model

The Studyond data model defines the core entities and relationships that power the [[Three-Sided Marketplace]]. All entity IDs use a human-readable format (e.g., `student-01`, `topic-45`) for easy reference in mock data.

## Users and Roles

Every user has a base profile (name, email, picture, about). Users can hold one or more roles:

- **Student** -- degree (bsc/msc/phd), study program, university, skills, objectives. See [[Students]].
- **Expert** -- title, company affiliation, interview availability, expertise fields. See [[Experts]].
- **Supervisor** -- university, research interests, published topics. See [[Supervisors]].

A single person can hold multiple roles (e.g., a PhD candidate might be both Student and Supervisor).

## Core Entities

- [[Topics]] -- thesis topics or job listings posted by [[Companies]] or [[Supervisors]]. Typed as `topic` (thesis/research) or `job` (employment).
- [[Thesis Projects]] -- the central joining entity that links a student with a topic, company experts, and supervisors. Follows the [[Thesis Project Lifecycle]].
- [[Companies]] -- organizations with subscriptions, experts, and published topics.
- [[Universities]] -- institutions containing [[Study Programs]], [[Supervisors]], and enrolled [[Students]].
- [[Study Programs]] -- degree programs (BSc, MSc, PhD) linked to a university.
- [[Fields]] -- academic and industry domains used for categorization and [[Matching Engine]] targeting.

## Project-First Model

[[Thesis Projects]] can exist without a topic assigned (`topicId: null`). Projects progressively accumulate context -- this is the foundation for [[Context Accumulation]]. A project starts as a student's intent and gradually fills in topic, company, supervisors, and experts as the collaboration takes shape.

## Entity Relationships

Universities have many [[Study Programs]], which have many [[Students]]. [[Companies]] have many [[Experts]]. Both companies and supervisors post [[Topics]]. The [[Thesis Projects]] entity connects students, topics, company experts, and supervisors into one collaboration. See `mock-data/types.ts` for full TypeScript definitions.
