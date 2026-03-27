export { fields, getFieldName } from './fields'
export type { FieldId } from './fields'

export { supervisors } from './supervisors'
export type { Supervisor } from './supervisors'

export { experts } from './experts'
export type { Expert } from './experts'

export { universities, getUniversityName } from './universities'

export { default as projects } from './projects.json'
export { default as topics } from './topics.json'

// Type definitions for mock-data
export interface Project {
  id: string
  title: string
  description: string | null
  motivation: string | null
  state: 'proposed' | 'applied' | 'agreed' | 'in_progress' | 'completed' | 'withdrawn' | 'rejected'
  studentId: string
  topicId: string | null
  companyId: string | null
  universityId: string
  supervisorIds: string[]
  expertIds: string[]
  createdAt: string
  updatedAt: string
}

export interface Topic {
  id: string
  title: string
  description: string
  type: 'topic' | 'job'
  employment: 'yes' | 'no' | 'open'
  employmentType: string | null
  workplaceType: string | null
  degrees: string[]
  fieldIds: string[]
  companyId: string | null
  universityId: string | null
  supervisorIds: string[]
  expertIds: string[]
}
