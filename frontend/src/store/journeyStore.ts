import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STAGES } from '@/lib/copy'
import { STAGE_ORDER, type StageId, type PlannerStatus } from '@/lib/stageConfig'
import { PLANNER_STAGE_IDS, STAGE_TASKS } from '@/lib/stageTasks'

// The shape of what the student fills in during intake
export interface IntakeData {
  topic: string
  university: string
  currentStage: string
  deadline: string
  degree: 'bsc' | 'msc' | 'phd'
  fieldIds: string[]
}

// Each stage can be: not started, active (current), done
export type StageStatus = 'not_started' | 'active' | 'done'

export interface StageState {
  id: StageId
  status: StageStatus
}

const DEFAULT_STAGES: StageState[] = STAGE_ORDER.map((id) => ({ id, status: 'not_started' }))

export interface PlannerTask {
  id: string
  stageId: StageId
  stageLabel: string
  text: string
  status: PlannerStatus
}

function normalizeStages(stages: StageState[] | undefined): StageState[] {
  const stageMap = new Map((stages ?? []).map((stage) => [stage.id, stage.status]))
  return STAGE_ORDER.map((id) => ({ id, status: stageMap.get(id) ?? 'not_started' }))
}

function getStageShortLabel(stageId: StageId): string {
  return STAGES.find((stage) => stage.id === stageId)?.shortLabel ?? stageId
}

function buildDefaultPlannerBoard(): PlannerTask[] {
  return PLANNER_STAGE_IDS.flatMap((stageId) => {
    const tasks = STAGE_TASKS[stageId] ?? []
    return tasks.map((text, index) => ({
      id: `${stageId}-default-${index}`,
      stageId,
      stageLabel: getStageShortLabel(stageId),
      text,
      status: 'todo' as PlannerStatus,
    }))
  })
}

function normalizePlannerBoard(board: PlannerTask[] | undefined): PlannerTask[] {
  if (!board || board.length === 0) return buildDefaultPlannerBoard()

  const validStatuses: PlannerStatus[] = ['todo', 'in_progress', 'done']

  return board
    .filter((task) => STAGE_ORDER.includes(task.stageId))
    .map((task, index) => {
      const stageId = task.stageId
      return {
        id: task.id ?? `task-${index}`,
        stageId,
        stageLabel: task.stageLabel ?? getStageShortLabel(stageId),
        text: task.text,
        status: validStatuses.includes(task.status) ? task.status : 'todo',
      }
    })
}

const createTaskId = () => `task-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10)}`

interface JourneyStore {
  // Has the student completed intake?
  hasStarted: boolean

  // Intake data from the form
  intake: IntakeData | null

  // Which stages are done/active/not started
  stages: StageState[]

  // Planner board data
  plannerBoard: PlannerTask[]

  // Actions
  startJourney: (intake: IntakeData) => void
  markStageDone: (stageId: StageId) => void
  addPlannerTask: (payload: { stageId: StageId; text: string }) => void
  updatePlannerTask: (taskId: string, updates: { text?: string; stageId?: StageId }) => void
  setPlannerTaskStatus: (taskId: string, status: PlannerStatus) => void
  removePlannerTask: (taskId: string) => void
  resetJourney: () => void
}

// Maps the intake's currentStage value to the stages array
function buildInitialStages(currentStage: string): StageState[] {
  const currentIndex = STAGE_ORDER.indexOf(currentStage as StageId)
  const safeIndex = currentIndex === -1 ? 0 : currentIndex

  return STAGE_ORDER.map((id, index) => ({
    id,
    status:
      index < safeIndex
        ? 'done'
        : index === safeIndex
          ? 'active'
          : 'not_started',
  }))
}

export const useJourneyStore = create<JourneyStore>()(
  persist(
    (set) => ({
      hasStarted: false,
      intake: null,
      stages: DEFAULT_STAGES,
      plannerBoard: buildDefaultPlannerBoard(),

      startJourney: (intake) => {
        set((state) => ({
          hasStarted: true,
          intake,
          stages: buildInitialStages(intake.currentStage),
          plannerBoard: state.plannerBoard.length ? state.plannerBoard : buildDefaultPlannerBoard(),
        }))
      },

      markStageDone: (stageId) => {
        set((state) => {
          const doneIndex = STAGE_ORDER.indexOf(stageId)
          if (doneIndex === -1) return state

          return {
            stages: STAGE_ORDER.map((id, index) => ({
              id,
              status:
                index < doneIndex
                  ? 'done'
                  : index === doneIndex
                    ? 'done'
                    : index === doneIndex + 1
                      ? 'active'
                      : 'not_started',
            })),
          }
        })
      },

      addPlannerTask: ({ stageId, text }) => {
        set((state) => ({
          plannerBoard: [
            {
              id: createTaskId(),
              stageId,
              stageLabel: getStageShortLabel(stageId),
              text: text.trim(),
              status: 'todo',
            },
            ...state.plannerBoard,
          ],
        }))
      },

      updatePlannerTask: (taskId, updates) => {
        set((state) => ({
          plannerBoard: state.plannerBoard.map((task) => {
            if (task.id !== taskId) return task
            const nextStageId = updates.stageId ?? task.stageId
            const nextText = updates.text?.trim()
            return {
              ...task,
              stageId: nextStageId,
              stageLabel: updates.stageId ? getStageShortLabel(nextStageId) : task.stageLabel,
              text: nextText && nextText.length > 0 ? nextText : task.text,
            }
          }),
        }))
      },

      setPlannerTaskStatus: (taskId, status) => {
        set((state) => ({
          plannerBoard: state.plannerBoard.map((task) =>
            task.id === taskId ? { ...task, status } : task
          ),
        }))
      },

      removePlannerTask: (taskId) => {
        set((state) => ({
          plannerBoard: state.plannerBoard.filter((task) => task.id !== taskId),
        }))
      },

      resetJourney: () => {
        set({
          hasStarted: false,
          intake: null,
          stages: DEFAULT_STAGES,
          plannerBoard: buildDefaultPlannerBoard(),
        })
      },
    }),
    {
      // This key is what gets saved to localStorage
      name: 'thesis-gps-journey',
      version: 2,
      migrate: (persistedState) => {
        if (!persistedState) return persistedState
        return {
          ...persistedState,
          stages: normalizeStages((persistedState as JourneyStore).stages),
          plannerBoard: normalizePlannerBoard((persistedState as JourneyStore).plannerBoard),
        }
      },
    }
  )
)
