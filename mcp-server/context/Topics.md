---
tags:
  - entity
---

# Topics

Topics are thesis topics, research questions, or job listings posted on Studyond by [[Companies]] or [[Supervisors]]. They are the primary content that [[Students]] browse, get matched with, and apply to.

## Key Properties

- **Title and description** -- the problem statement or opportunity
- **Type** -- `topic` (thesis/research) or `job` (employment listing)
- **Employment status** -- `yes`, `no`, or `open` (whether the topic can lead to a job)
- **Employment type** -- `internship`, `working_student`, `graduate_program`, or `direct_entry` (when employment applies)
- **Workplace type** -- `on_site`, `hybrid`, or `remote`
- **Degree level** -- Bachelor, Master, PhD (can target multiple)
- **Fields** -- subject areas and disciplines (many-to-many relationship with [[Fields]])

## Ownership

Topics are posted by either a [[Companies|company]] (with associated [[Experts]]) or a [[Supervisors|supervisor]] at a [[Universities|university]]. Company topics have `companyId` set and `expertIds` listing 1-2 experts. Supervisor topics have `universityId` set and `supervisorIds` with at least one supervisor. A topic is never owned by both a company and a university simultaneously.

## Platform Scale

There are 7,500+ active topics from 185+ [[Companies]] across industries on the platform. Topics are discoverable through manual browsing with filters, the [[Matching Engine]]'s AI-powered suggestions, and the [[Student AI Agent]]'s conversational recommendations.

## Role in the Platform

Topics drive the initial connection between [[Students]] and [[Companies]] or [[Supervisors]]. When a student applies to a topic, a [[Thesis Projects|thesis project]] is created, entering the [[Thesis Project Lifecycle]]. Topics also feed the [[Thesis-to-Hire Pipeline]] -- companies post jobs alongside thesis topics, creating a natural pathway from academic collaboration to employment.
