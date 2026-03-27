import { useEffect, useMemo, useState } from 'react'
import type { PlannerTask } from '@/store/journeyStore'
import type { PlannerStatus, StageId } from '@/lib/stageConfig'

const STATUS_LABELS: Record<PlannerStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

const STATUS_OPTIONS: Array<{ value: PlannerStatus; label: string }> = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

interface KanbanColumnProps {
  title: string
  items: PlannerTask[]
  stageOptions: Array<{ id: StageId; label: string }>
  borderColor: string
  textColor: string
  mutedColor: string
  onStatusChange: (taskId: string, status: PlannerStatus) => void
  onUpdateTask: (taskId: string, updates: { text?: string; stageId?: StageId }) => void
  onDeleteTask: (taskId: string) => void
}

export function KanbanColumn({
  title,
  items,
  stageOptions,
  borderColor,
  textColor,
  mutedColor,
  onStatusChange,
  onUpdateTask,
  onDeleteTask,
}: KanbanColumnProps) {
  return (
    <div className="rounded-lg p-3 h-full" style={{ border: `1px solid ${borderColor}`, backgroundColor: '#FFFFFF' }}>
      <div className="flex items-center justify-between gap-2">
        <p className="ds-small font-semibold" style={{ color: textColor }}>{title}</p>
        <span className="ds-caption" style={{ color: mutedColor }}>{items.length}</span>
      </div>
      <div className="mt-3 space-y-2 max-h-[28rem] overflow-y-auto pr-1">
        {items.map((item) => (
          <TaskCard
            key={item.id}
            item={item}
            stageOptions={stageOptions}
            borderColor={borderColor}
            textColor={textColor}
            mutedColor={mutedColor}
            onStatusChange={onStatusChange}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
        {items.length === 0 && (
          <p className="ds-caption" style={{ color: mutedColor }}>No items in this column.</p>
        )}
      </div>
    </div>
  )
}

interface TaskCardProps {
  item: PlannerTask
  stageOptions: Array<{ id: StageId; label: string }>
  borderColor: string
  textColor: string
  mutedColor: string
  onStatusChange: (taskId: string, status: PlannerStatus) => void
  onUpdateTask: (taskId: string, updates: { text?: string; stageId?: StageId }) => void
  onDeleteTask: (taskId: string) => void
}

function TaskCard({
  item,
  stageOptions,
  borderColor,
  textColor,
  mutedColor,
  onStatusChange,
  onUpdateTask,
  onDeleteTask,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftText, setDraftText] = useState(item.text)
  const statusLabel = useMemo(() => STATUS_LABELS[item.status], [item.status])

  useEffect(() => {
    setDraftText(item.text)
  }, [item.text])

  function handleSave() {
    const trimmed = draftText.trim()
    if (!trimmed || trimmed === item.text) {
      setIsEditing(false)
      setDraftText(item.text)
      return
    }
    onUpdateTask(item.id, { text: trimmed })
    setIsEditing(false)
  }

  return (
    <article
      className="rounded-lg p-3 space-y-2"
      style={{ border: `1px solid ${borderColor}`, backgroundColor: '#FAFAFA' }}
    >
      <div className="flex items-center justify-between gap-2">
        <select
          value={item.stageId}
          onChange={(e) => onUpdateTask(item.id, { stageId: e.target.value as StageId })}
          className="ds-caption bg-transparent"
          style={{ color: textColor }}
        >
          {stageOptions.map((stage) => (
            <option key={stage.id} value={stage.id}>{stage.label}</option>
          ))}
        </select>
        <label className="ds-caption" style={{ color: mutedColor }}>
          <span className="sr-only">Status for {item.text}</span>
          <select
            value={item.status}
            onChange={(e) => onStatusChange(item.id, e.target.value as PlannerStatus)}
            className="bg-transparent"
            style={{ color: mutedColor }}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            rows={3}
            className="w-full rounded-md border px-3 py-2 ds-small"
            style={{ borderColor, color: textColor }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              className="ds-caption px-3 py-1 rounded-md"
              style={{ backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none' }}
              onClick={handleSave}
            >
              Save
            </button>
            <button
              type="button"
              className="ds-caption px-3 py-1 rounded-md"
              style={{ border: `1px solid ${borderColor}`, color: textColor }}
              onClick={() => {
                setIsEditing(false)
                setDraftText(item.text)
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="ds-small" style={{ color: textColor }}>{item.text}</p>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="ds-caption" style={{ color: mutedColor }}>{statusLabel}</span>
        <div className="flex gap-1">
          <button
            type="button"
            className="ds-caption px-2 py-1 rounded-md"
            style={{ border: `1px solid ${borderColor}`, color: textColor }}
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? 'Close' : 'Edit'}
          </button>
          <button
            type="button"
            className="ds-caption px-2 py-1 rounded-md"
            style={{ border: `1px solid ${borderColor}`, color: '#B42318' }}
            onClick={() => onDeleteTask(item.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}
