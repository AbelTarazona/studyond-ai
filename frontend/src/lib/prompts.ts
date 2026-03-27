// All AI prompts live here.
// Non-coders: you can edit the text inside these without touching any component code.
// Just keep the ${variable} placeholders exactly as they are.

export const SYSTEM_PROMPT_BASE = `
You are Thesis GPS, an AI guide built into the Studyond platform.
Studyond connects students, companies, and universities around thesis projects in Switzerland.

Your job is to give students clear, specific, confidence-building guidance.
You know the real data: supervisors, companies, experts, and thesis topics on the platform.
You never give generic advice. You always reference what is actually available.

Tone: calm, direct, like a senior student who has done this before.
Never say "I understand your frustration." Just help.
Keep responses under 150 words unless the student asks for more.
`.trim()

export const ACTION_CARD_PROMPT = ({
  stage,
  topic,
  university,
  deadline,
  weeksLeft,
  urgency,
}: {
  stage: string
  topic: string
  university: string
  deadline: string
  weeksLeft: number
  urgency: string
}) => `
The student is at stage: "${stage}"
Their topic area: "${topic || 'not decided yet'}"
University: "${university}"
Deadline: ${deadline} (${weeksLeft} weeks away, urgency: ${urgency})

Give them a structured action plan in JSON format.
Return valid JSON with these fields:
{
  "action": string (one 5-10 word action in present tense, e.g. "Schedule meetings with supervisors"),
  "rationale": string (1-2 sentences explaining why this action is important now),
  "confidence": number (0-100, how confident you are this will help),
  "blockers": string[] (potential obstacles they might face, array of 1-3 strings),
  "suggested_contacts": string[] (IDs or names of contacts who could help, e.g. ["supervisor-01", "expert-05"])
}

Be specific. Reference real data when possible.
`.trim()

export const STUCK_PROMPT = ({
  stage,
  topic,
  blocker,
}: {
  stage: string
  topic: string
  blocker: string
}) => `
The student is stuck at stage: "${stage}"
Their topic: "${topic || 'not decided yet'}"
They said: "${blocker}"

Diagnose what is actually blocking them (often it is not what they say it is).
Then give one concrete next action they can take in the next 2 hours.
Be direct. Do not ask clarifying questions unless absolutely necessary.
`.trim()

export const OUTREACH_PROMPT = ({
  studentName,
  recipientName,
  recipientRole,
  recipientOrg,
  topic,
  matchReason,
  stage,
}: {
  studentName: string
  recipientName: string
  recipientRole: string
  recipientOrg: string
  topic: string
  matchReason: string
  stage: string
}) => `
Write a short outreach email from ${studentName} to ${recipientName} (${recipientRole} at ${recipientOrg}).
The student is working on: "${topic}"
Why this person is relevant: "${matchReason}"
Student's current stage: "${stage}"

Keep it under 120 words. No fluff. End with one clear ask.
Subject line should be specific, not generic.
Return as JSON: { "subject": "...", "body": "..." }
`.trim()

// Platform context from Studyond's Thesis Projects model — used to ground the health score analysis
const THESIS_PROJECTS_CONTEXT = `
# Studyond Platform: Thesis Projects

Thesis Projects are the core collaboration entity on Studyond. A thesis project links a student with a topic, company, and supervisor(s) into a single structured collaboration.

## Key Properties
- Title and description — what the thesis is about
- Motivation — why the student wants to work on this
- Student, Topic, Company, University, Supervisors, Experts
- State — current position in the lifecycle

## Project-First Model
A project can exist before a topic is assigned. It starts as a student's intent and progressively fills in topic, company, supervisors, and experts as the collaboration takes shape.

## Lifecycle
proposed → applied → agreed → in_progress → completed (with alternative paths for withdrawal, rejection, cancellation)

## Evaluation Context
When assessing supervisor_readiness, consider whether the document is developed enough to be shared with an academic supervisor for structured feedback. For academic_fit, consider alignment with the Studyond collaboration model: clear topic scope, defined research question, institutional fit.
`.trim()

export const THESIS_HEALTH_SCORE_PROMPT = ({ documentText }: { documentText: string }) => `
You are analyzing a student's thesis document on the Studyond platform. Use the platform context below together with the student's document to evaluate the thesis across 5 dimensions.

## Platform Context
${THESIS_PROJECTS_CONTEXT}

## Student's Document
"""
${documentText.slice(0, 7000)}
"""

Return ONLY valid JSON with exactly these fields:
{
  "properties": {
    "title": string | null,
    "description": string | null (1-2 sentence description of what the thesis is about),
    "motivation": string | null (why the student wants to work on this, or null if not stated),
    "student": string | null (student name if mentioned),
    "topic": string | null (research topic or field),
    "company": string | null (company partner if mentioned),
    "university": string | null (university if mentioned),
    "supervisors": string[] (list of supervisor names, empty array if none found),
    "experts": string[] (list of expert/company-side names, empty array if none found),
    "state": "proposed" | "applied" | "agreed" | "in_progress" | "completed" | null
  },
  "clarity": "low" | "medium" | "high",
  "clarity_note": string (1 sentence explaining what is clear or what is missing),
  "academic_fit": "low" | "medium" | "high",
  "academic_fit_note": string (1 sentence on alignment with academic and Studyond standards),
  "method_readiness": "low" | "medium" | "high",
  "method_readiness_note": string (1 sentence on the state of the methodology),
  "resources_readiness": "low" | "medium" | "high",
  "resources_readiness_note": string (1 sentence on literature review and sources coverage),
  "supervisor_readiness": "low" | "medium" | "high",
  "supervisor_readiness_note": string (1 sentence on readiness to share with a supervisor),
  "summary": string (1-2 sentences, overall assessment of where the thesis stands right now)
}

Definitions for health scores:
- clarity: How clearly the research question, scope, and argument are defined
- academic_fit: How well the work aligns with academic/Studyond collaboration standards and the field's conventions
- method_readiness: How developed and justified the methodology is
- resources_readiness: How complete the literature review and data/sources are
- supervisor_readiness: How ready this document is to share with a supervisor for structured feedback (per the Studyond lifecycle)

For properties: extract only what is explicitly stated or clearly implied in the document. Use null when not found. Keep each _note to one sentence. Be honest. Do not inflate scores.
`.trim()

export const MATCH_EXPLANATION_PROMPT = ({
  studentTopic,
  studentFields,
  entityName,
  entityRole,
  entityFields,
  entityAbout,
}: {
  studentTopic: string
  studentFields: string[]
  entityName: string
  entityRole: string
  entityFields: string[]
  entityAbout: string
}) => `
Explain in one sentence why ${entityName} (${entityRole}) is a good match for a student working on "${studentTopic}".
Student fields: ${studentFields.join(', ')}
${entityName}'s fields: ${entityFields.join(', ')}
About ${entityName}: "${entityAbout}"

Be specific. Reference actual overlapping areas. Max 25 words.
`.trim()
