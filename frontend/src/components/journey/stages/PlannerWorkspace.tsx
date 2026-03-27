import { useMemo, useState } from 'react'
import { KanbanColumn } from './KanbanColumn'
import { STAGES } from '@/lib/copy'
import { PLANNER_STAGE_IDS } from '@/lib/stageTasks'
import type { PlannerTask } from '@/store/journeyStore'
import type { PlannerStatus, StageId } from '@/lib/stageConfig'

interface PlannerWorkspaceProps {
  plannerItems: PlannerTask[]
  onAddPlannerItem: (payload: { stageId: StageId; text: string }) => void
  onUpdatePlannerItem: (taskId: string, updates: { text?: string; stageId?: StageId }) => void
  onPlannerStatusChange: (taskId: string, status: PlannerStatus) => void
  onRemovePlannerItem: (taskId: string) => void
  borderColor: string
  textColor: string
  mutedColor: string
}

const STATUS_COLUMNS: Array<{ title: string; status: PlannerStatus }> = [
  { title: 'To Do', status: 'todo' },
  { title: 'In Progress', status: 'in_progress' },
  { title: 'Done', status: 'done' },
]

export function PlannerWorkspace({
  plannerItems,
  onAddPlannerItem,
  onUpdatePlannerItem,
  onPlannerStatusChange,
  onRemovePlannerItem,
  borderColor,
  textColor,
  mutedColor,
}: PlannerWorkspaceProps) {
  const stageOptions = useMemo(
    () =>
      STAGES.filter((stage) => PLANNER_STAGE_IDS.includes(stage.id as StageId)).map((stage) => ({
        id: stage.id as StageId,
        label: stage.shortLabel ?? stage.label,
      })),
    []
  )

  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskStage, setNewTaskStage] = useState<StageId>(stageOptions[0]?.id ?? 'planning')
  const [formError, setFormError] = useState<string | null>(null)

  const grouped = useMemo<Record<PlannerStatus, PlannerTask[]>>(
    () => ({
      todo: plannerItems.filter((t) => t.status === 'todo'),
      in_progress: plannerItems.filter((t) => t.status === 'in_progress'),
      done: plannerItems.filter((t) => t.status === 'done'),
    }),
    [plannerItems]
  )

  function handleAddTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = newTaskText.trim()
    if (!trimmed) {
      setFormError('Add a short description before saving the card.')
      return
    }
    onAddPlannerItem({ stageId: newTaskStage, text: trimmed })
    setNewTaskText('')
    setFormError(null)
  }

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="ds-label font-semibold" style={{ color: textColor }}>
          Project Manager Board
        </p>
        <p className="ds-caption" style={{ color: mutedColor }}>
          Drag-free controls — update stage, status, or rename tasks in place.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {STATUS_COLUMNS.map(({ title, status }) => (
          <KanbanColumn
            key={status}
            title={title}
            items={grouped[status]}
            stageOptions={stageOptions}
            borderColor={borderColor}
            textColor={textColor}
            mutedColor={mutedColor}
            onStatusChange={onPlannerStatusChange}
            onUpdateTask={onUpdatePlannerItem}
            onDeleteTask={onRemovePlannerItem}
          />
        ))}
      </div>

      <form
        onSubmit={handleAddTask}
        className="rounded-lg p-4 space-y-3"
        style={{ border: `1px solid ${borderColor}`, backgroundColor: '#FFFFFF' }}
      >
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <label className="ds-caption mb-1 block" style={{ color: mutedColor }}>
              New task
            </label>
            <textarea
              value={newTaskText}
              onChange={(e) => {
                setNewTaskText(e.target.value)
                if (formError) setFormError(null)
              }}
              rows={2}
              className="w-full rounded-md border px-3 py-2 ds-small"
              style={{ borderColor, color: textColor }}
              placeholder="e.g. Align company brief with research questions"
            />
          </div>
          <div className="md:w-60">
            <label className="ds-caption mb-1 block" style={{ color: mutedColor }}>
              Stage
            </label>
            <select
              value={newTaskStage}
              onChange={(e) => setNewTaskStage(e.target.value as StageId)}
              className="w-full rounded-md border px-3 py-2 ds-small"
              style={{ borderColor, color: textColor }}
            >
              {stageOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        {formError && (
          <p className="ds-caption" style={{ color: '#B42318' }}>{formError}</p>
        )}
        <button
          type="submit"
          className="ds-label px-4 py-2 rounded-md"
          style={{ backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none' }}
        >
          Add card
        </button>
      </form>

      <div className="rounded-lg p-4" style={{ border: `1px solid ${borderColor}`, backgroundColor: '#FFFFFF' }}>
        <p className="ds-label font-semibold" style={{ color: textColor }}>Things you still need to do</p>
        <ul className="mt-2 space-y-1">
          {grouped.todo.slice(0, 8).map((item) => (
            <li key={item.id} className="ds-small" style={{ color: mutedColor }}>
              • [{item.stageLabel}] {item.text}
            </li>
          ))}
          {grouped.todo.length === 0 && (
            <li className="ds-small" style={{ color: mutedColor }}>All tracked tasks are complete for now.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
