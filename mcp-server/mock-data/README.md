# Mock Data

Mock dataset for **Start Hack 2026** hackathon teams building AI-powered
thesis-journey prototypes for [Studyond](https://studyond.com).

The data models the Swiss higher-education landscape: universities, study
programs, students, supervisors, companies, industry experts, thesis topics,
and thesis projects at every stage of their lifecycle.

---

## Entity Relationships

```
University ─── has many ──→ Study Programs ─── has many ──→ Students
    │                                                          │
    │                                                          │
    ├── has many ──→ Supervisors ──→ post ──→ Topics           │
    │                                  (supervisor topics)     │
    │                                                          │
    │                              Topics ←── post ──┐         │
    │                           (company topics)     │         │
    │                                                │         │
    │                          Companies ─── have ──→ Experts  │
    │                              │                           │
    │                              │                           │
    └──────────────── Thesis Project ──────────────────────────┘
                    (links them all together)
```

---

## Entities

| Entity | Description |
|---|---|
| **University** | A Swiss university or university of applied sciences. |
| **StudyProgram** | A degree program (BSc / MSc / PhD) offered by one university. |
| **Field** | An academic/industry field such as *Data Science* or *Supply Chain Management*. Shared across all entity types. |
| **Student** | A student enrolled in one study program at one university. The chain `Student → StudyProgram → University` is always consistent. |
| **Supervisor** | An academic supervisor at a university. The `title` field holds an academic honorific (e.g. *"Prof. Dr."*). |
| **Company** | A Swiss or multinational company offering thesis topics or jobs. |
| **Expert** | An industry professional at a company. The `title` field holds a job role (e.g. *"Head of Data Science"*). |
| **Topic** | A thesis topic or job listing. Owned by **either** a company (via `companyId`) **or** a university (via `universityId`) -- never both. Company topics list `expertIds`; supervisor topics list `supervisorIds`. |
| **ThesisProject** | A student's thesis project. Links a student to a topic, supervisors, and experts. |

---

## Project-First Model

Projects can exist **without a topic**. The intended workflow is:

1. A student creates a project with just a title and motivation.
2. Over time they discover and attach a topic, supervisor, and/or experts.
3. The project progresses through states: `proposed → applied → agreed → in_progress → completed` (or `withdrawn` / `rejected` / `canceled`).

The mock data includes projects at every stage of this journey -- from
topic-less proposals to fully completed theses. **This is the direction
hackathon solutions should explore**: helping students navigate from a vague
idea to a concrete, supervised thesis project.

---

## Files

| File | Records | Description |
|---|--:|---|
| `universities.json` | 10 | Swiss universities and universities of applied sciences |
| `study-programs.json` | 30 | Degree programs (BSc, MSc, PhD) |
| `fields.json` | 20 | Academic and industry fields |
| `students.json` | 40 | Students across all 10 universities |
| `supervisors.json` | 25 | Academic supervisors |
| `companies.json` | 15 | Swiss and multinational companies |
| `experts.json` | 30 | Industry experts at those companies |
| `topics.json` | 60 | Thesis topics and job listings (30 company, 30 supervisor) |
| `projects.json` | 15 | Thesis projects at various lifecycle stages |
| `types.ts` | -- | TypeScript interfaces and enums (reference only) |

---

## ID Format

All IDs are human-readable, following the pattern `entity-NN`:

```
student-01, supervisor-12, topic-45, project-03, ...
```

This makes it easy to trace references while debugging or exploring the data
in a REPL.

---

## Type Reference

See [`types.ts`](types.ts) for the full TypeScript interfaces and enum
definitions. The file is a **reference document only** -- it is not imported at
runtime. Use it to understand the data model, generate types, or build
validation schemas.

---

## Extending the Data

Teams are welcome to generate additional records using an LLM. To keep things
consistent:

- Follow the same ID convention (`entity-NN`, incrementing from the last used number).
- Match the existing schema defined in `types.ts`.
- Respect the ownership rule: a topic has **either** `companyId` **or** `universityId`, never both.
- Keep expert `title` values as job roles and supervisor `title` values as academic honorifics.
- Ensure the `Student → StudyProgram → University` chain is consistent.
