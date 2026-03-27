export const STAGE_ORDER = [
  'orientation',
  'application',
  'supervisor',
  'planning',
  'execution',
  'writing',
  'submission',
  'apply_jobs',
] as const

export type StageId = typeof STAGE_ORDER[number]

export type PlannerStatus = 'todo' | 'in_progress' | 'done'
