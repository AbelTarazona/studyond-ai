import { OrientationWorkspace } from './stages/OrientationWorkspace'
import { SupervisorWorkspace } from './stages/SupervisorWorkspace'
import { ApplicationWorkspace } from './stages/ApplicationWorkspace'
import { PlannerWorkspace } from './stages/PlannerWorkspace'
import { WritingWorkspace } from './stages/WritingWorkspace'
import type { StageId, PlannerStatus } from '@/lib/stageConfig'
import type { PlannerTask } from '@/store/journeyStore'

interface StageWorkspaceProps {
  activeStageId: StageId
  topic: string
  applicationRecommendations: {
    topics: Array<{
      score: number
      relevance: string
      topic: {
        id: string
        title: string
        description: string
        companyId: string | null
        universityId: string | null
      }
    }>
  }
  supervisorRecommendations: {
    experts: Array<{
      score: number
      relevance: string
      expert: { id: string; firstName: string; lastName: string; companyName?: string; title: string }
    }>
    supervisors: Array<{
      score: number
      relevance: string
      supervisor: { id: string; firstName: string; lastName: string; title: string }
    }>
  }
  plannerItems: PlannerTask[]
  onAddPlannerItem: (payload: { stageId: StageId; text: string }) => void
  onUpdatePlannerItem: (taskId: string, updates: { text?: string; stageId?: StageId }) => void
  onPlannerStatusChange: (taskId: string, status: PlannerStatus) => void
  onRemovePlannerItem: (taskId: string) => void
  borderColor: string
  textColor: string
  mutedColor: string
  accentBlue: string
}

export function StageWorkspace({
  activeStageId,
  topic,
  applicationRecommendations,
  supervisorRecommendations,
  plannerItems,
  onAddPlannerItem,
  onUpdatePlannerItem,
  onPlannerStatusChange,
  onRemovePlannerItem,
  borderColor,
  textColor,
  mutedColor,
  accentBlue,
}: StageWorkspaceProps) {
  return (
    <section className="px-4 sm:px-6 pb-8 pt-5" style={{ borderTop: `1px solid ${borderColor}` }}>
      <div className="mb-4">
        <h3 className="ds-title-sm font-semibold" style={{ color: textColor }}>
          Stage Workspace
        </h3>
        <p className="ds-small" style={{ color: mutedColor }}>
          Scroll for recommendations and project management tools for your current phase.
        </p>
      </div>

      {activeStageId === 'orientation' && (
        <OrientationWorkspace
          topic={topic}
          borderColor={borderColor}
          textColor={textColor}
          mutedColor={mutedColor}
          accentBlue={accentBlue}
        />
      )}

      {activeStageId === 'supervisor' && (
        <SupervisorWorkspace
          supervisorRecommendations={supervisorRecommendations}
          borderColor={borderColor}
          textColor={textColor}
          mutedColor={mutedColor}
          accentBlue={accentBlue}
        />
      )}

      {activeStageId === 'application' && (
        <ApplicationWorkspace
          topic={topic}
          applicationRecommendations={applicationRecommendations}
          borderColor={borderColor}
          textColor={textColor}
          mutedColor={mutedColor}
          accentBlue={accentBlue}
        />
      )}

      {activeStageId === 'writing' && (
        <WritingWorkspace
          borderColor={borderColor}
          textColor={textColor}
          mutedColor={mutedColor}
          accentBlue={accentBlue}
        />
      )}

      {!['orientation', 'supervisor', 'application', 'writing'].includes(activeStageId) && (
        <PlannerWorkspace
          plannerItems={plannerItems}
          onAddPlannerItem={onAddPlannerItem}
          onUpdatePlannerItem={onUpdatePlannerItem}
          onPlannerStatusChange={onPlannerStatusChange}
          onRemovePlannerItem={onRemovePlannerItem}
          borderColor={borderColor}
          textColor={textColor}
          mutedColor={mutedColor}
        />
      )}
    </section>
  )
}
