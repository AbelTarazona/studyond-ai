import type { StageId } from './stageConfig'

export type StageTaskMap = Partial<Record<StageId, string[]>>

export const PLANNER_STAGE_IDS: StageId[] = ['planning', 'execution', 'writing', 'submission', 'apply_jobs']

export const STAGE_TASKS: StageTaskMap = {
  orientation: ['Define research question', 'Review literature scope', 'Align with advisor interests'],
  supervisor: ['Review publications list (2022–2024)', 'Map project scope to lab resources', 'Draft initial outreach communication'],
  application: ['Shortlist 3 company projects and 2 university projects', 'Submit applications with tailored motivation', 'Track responses and compare offer fit'],
  planning: ['Draft methodology outline', 'Create project timeline', 'Confirm company partner alignment'],
  execution: ['Conduct expert interviews', 'Collect & clean dataset', 'Iterate on findings with advisor'],
  writing: ['Draft introduction & conclusion', 'Peer review round', 'Final formatting & citation check'],
  submission: ['Run final plagiarism and formatting checks', 'Prepare defense summary deck', 'Submit thesis package before deadline'],
  apply_jobs: ['Extract 3 resume bullets from thesis outcomes', 'Prepare portfolio summary of your thesis impact', 'Apply to 5 role-aligned openings with tailored outreach'],
}
