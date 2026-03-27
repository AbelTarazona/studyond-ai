---
tags:
  - entity
---

# Fields

Fields are academic and industry domains used for categorization and matching across the Studyond platform. They connect [[Students]], [[Topics]], [[Supervisors]], and [[Experts]] through shared subject-area tagging.

## Examples

Data Science, Supply Chain Management, Sustainability, AI/Machine Learning, Finance, Marketing, Mechanical Engineering, Business Strategy, Human Resources, Information Systems, and others. The mock data includes 20 fields covering the major disciplines represented on the platform.

## How Fields Work

Both [[Students]] and [[Topics]] are tagged with one or more fields, enabling the [[Matching Engine]] to suggest relevant matches. When a student's field tags overlap with a topic's field tags, the match score increases. Similarly, [[Supervisors]] and [[Experts]] declare field associations that help the platform connect them with relevant [[Thesis Projects]] and collaboration opportunities.

## Entity Relationships

- **Students** -- select fields during onboarding to indicate their areas of interest and expertise
- **Topics** -- tagged with fields by [[Companies]] or [[Supervisors]] when published
- **Supervisors** -- declare fields aligned with their research interests
- **Experts** -- declare fields aligned with their professional domain

## Role in the Platform

Fields serve as the primary vocabulary for cross-entity matching. They allow the [[Matching Engine]] to bridge the gap between what [[Students]] study and what [[Companies]] need, making them essential to the [[Three-Sided Marketplace]]'s value proposition. See [[Data Model]] for the TypeScript definition (`Field` interface).
