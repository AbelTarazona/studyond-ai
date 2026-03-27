import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, User, Calendar, Zap, PenLine, Check, FileCheck2, Briefcase, ClipboardCheck } from 'lucide-react'
import { STAGES, URGENCY_MESSAGES } from '@/lib/copy'
import { weeksUntil, getUrgency } from '@/lib/utils'
import { useJourneyStore, type StageState } from '@/store/journeyStore'
import { ActionCard } from '@/components/journey/ActionCard'
import { StageWorkspace } from '@/components/journey/StageWorkspace'
import { useMatches } from '@/hooks/useMatches'
import { useRecommendations } from '@/hooks/useRecommendations'
import { getFieldName, getUniversityName } from '@/data'
import type { StageId } from '@/lib/stageConfig'
import { STAGE_TASKS } from '@/lib/stageTasks'
import mapImage from '@/assets/map.png'
import contourMapImage from '@/assets/Contour-Map.svg'

const STAGE_ICONS: Record<StageId, React.ElementType> = {
  orientation: Compass,
  supervisor:  User,
  application: ClipboardCheck,
  planning:    Calendar,
  execution:   Zap,
  writing:     PenLine,
  submission:  FileCheck2,
  apply_jobs:  Briefcase,
}

interface JourneyMapProps {
  onStuck: (stageId: string) => void
  onReset?: () => void
}

// Node positions in the SVG coordinate space (viewBox 0 0 240 150)
const NODE_POSITIONS = [
  { id: 'orientation', x: 20,  y: 112, label: 'NODE_ORIENT', stageName: 'ORIENTATION' },
  { id: 'application', x: 48,  y: 74,  label: 'NODE_APPLY',  stageName: 'APPLICATION' },
  { id: 'supervisor',  x: 76,  y: 102, label: 'NODE_SUPV',   stageName: 'SUPERVISOR'  },
  { id: 'planning',    x: 104, y: 68,  label: 'NODE_PLAN',   stageName: 'PLANNING'    },
  { id: 'execution',   x: 136, y: 100, label: 'NODE_EXEC',   stageName: 'EXECUTION'   },
  { id: 'writing',     x: 166, y: 66,  label: 'NODE_WRITE',  stageName: 'WRITING'     },
  { id: 'submission',  x: 196, y: 98,  label: 'NODE_SUBMIT', stageName: 'SUBMISSION'  },
  { id: 'apply_jobs',  x: 226, y: 70,  label: 'NODE_JOBS',   stageName: 'JOBS'        },
]


const sidebarItem = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.07, duration: 0.3, ease: 'easeOut' },
  }),
}

const cardVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:   { opacity: 0, x: -20, transition: { duration: 0.2 } },
}

export function JourneyMap({ onStuck, onReset }: JourneyMapProps) {
  const {
    intake,
    stages,
    plannerBoard,
    markStageDone,
    resetJourney,
    addPlannerTask,
    updatePlannerTask,
    setPlannerTaskStatus,
    removePlannerTask,
  } = useJourneyStore()
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({})
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null)

  if (!intake) return null

  const weeksLeft     = weeksUntil(intake.deadline)
  const urgency       = getUrgency(weeksLeft)
  const activeStage   = stages.find((s) => s.status === 'active')
  const doneCount     = stages.filter((s) => s.status === 'done').length
  const pct           = Math.round((doneCount / stages.length) * 100)
  const selectedStage = selectedStageId ? stages.find((s) => s.id === selectedStageId) ?? null : null
  const selectedMeta  = selectedStage ? STAGES.find((s) => s.id === selectedStage.id) ?? null : null
  const selectedIndex = selectedStage ? stages.findIndex((s) => s.id === selectedStage.id) : 0
  const tasks         = selectedStage ? (STAGE_TASKS[selectedStage.id] ?? []) : []
  const isActiveSelected = selectedStage?.status === 'active'
  const remainingNotStarted = stages.filter((s) => s.status === 'not_started').length
  const visibleMilestones = urgency === 'urgent'
    ? stages.filter((s) => s.status !== 'not_started')
    : stages
  const { topSupervisors, topExperts } = useMatches(intake.fieldIds, 2)
  const recommendations = useRecommendations(
    selectedStage?.id as StageId || 'orientation',
    intake.topic,
    intake.fieldIds
  )
  const applicationRecommendations = useRecommendations('application', intake.topic, intake.fieldIds)
  const supervisorRecommendations = useRecommendations('supervisor', intake.topic, intake.fieldIds)
  const activeStageId = (activeStage?.id as StageId | undefined) ?? 'orientation'


  function toggleTask(key: string) {
    setCheckedTasks((p) => ({ ...p, [key]: !p[key] }))
  }

  // Studyond brand color palette
  const urgencyColor = urgency === 'urgent' ? '#E63946' : urgency === 'moderate' ? '#F77F00' : '#2563EB'
  const textColor = '#1A1A1A'
  const mutedColor = '#808080'
  const borderColor = '#ECECEC'
  const bgColor = '#FFFFFF'
  const accentBlue = '#2563EB'

  return (
    <div
      className="flex flex-col bg-white"
      style={{ height: '100vh' }}
    >
      {/* ── Top bar with map header & global progress ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-shrink-0 border-b"
        style={{ borderColor, backgroundColor: bgColor }}
      >
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Compass size={18} color={accentBlue} strokeWidth={2} />
            <div>
              <h1 className="ds-title-md font-semibold" style={{ color: textColor }}>
                THESIS GPS // MAIN MAP
              </h1>
              <p className="ds-small" style={{ color: mutedColor }}>
                {intake.topic ? `${intake.topic.slice(0, 40)}${intake.topic.length > 40 ? '…' : ''}` : 'Your thesis journey'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              resetJourney()
              onReset?.()
            }}
            className="ds-label px-4 py-2 rounded transition-colors"
            style={{
              color: accentBlue,
              backgroundColor: 'transparent',
              border: `1px solid ${borderColor}`,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F5F5' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
          >
            Reset Journey
          </button>
        </div>
        
        {/* Progress bar under header */}
        <div className="px-6 pb-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="ds-small" style={{ color: mutedColor }}>Overall Progress</span>
              <span className="ds-label font-semibold" style={{ color: accentBlue }}>{pct}%</span>
            </div>
            <div style={{ height: 6, backgroundColor: borderColor, borderRadius: 3, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ height: '100%', backgroundColor: accentBlue, borderRadius: 3 }}
              />
            </div>
            <p className="ds-caption mt-2" style={{ color: mutedColor }}>
              Estimated completion: {Math.max(1, Math.round(weeksLeft / 4))} months
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Body: map + right sidebar ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Main map area ── */}
        <div className="flex-1 overflow-y-auto border-r" style={{ borderColor }}>
          <div className="relative" style={{ height: 'min(68vh, 620px)', minHeight: 420 }}>
            <NodeMap stages={stages} onSelect={setSelectedStageId} />
          </div>

          <StageWorkspace
            activeStageId={((selectedStageId ?? activeStageId) as StageId)}
            topic={intake.topic}
            applicationRecommendations={applicationRecommendations}
            supervisorRecommendations={supervisorRecommendations}
            plannerItems={plannerBoard}
            onAddPlannerItem={addPlannerTask}
            onUpdatePlannerItem={updatePlannerTask}
            onPlannerStatusChange={setPlannerTaskStatus}
            onRemovePlannerItem={removePlannerTask}
            borderColor={borderColor}
            textColor={textColor}
            mutedColor={mutedColor}
            accentBlue={accentBlue}
          />
        </div>

        {/* Stage detail panel — right of map */}
        <AnimatePresence mode="wait">
          {selectedMeta && selectedStage && (
            <motion.div
              key={selectedStage.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-shrink-0 scrollbar-hide overflow-y-auto"
              style={{
                width: 360,
                borderLeft: `1px solid ${borderColor}`,
                backgroundColor: bgColor,
              }}
            >
                  {/* Card header */}
                  <div
                    className="flex items-center justify-between px-5 py-4 border-b"
                    style={{ borderColor, backgroundColor: '#F5F5F5' }}
                  >
                    <div>
                      <p className="ds-label" style={{ color: mutedColor }}>
                        Stage {selectedIndex + 1} of {stages.length}
                      </p>
                      <h2 className="ds-title-sm font-semibold" style={{ color: textColor }}>
                        {selectedMeta.label}
                      </h2>
                    </div>
                    <button
                      onClick={() => setSelectedStageId(null)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: mutedColor,
                        fontSize: 20,
                        lineHeight: 1,
                        padding: '0 4px',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = textColor }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = mutedColor }}
                    >
                      ×
                    </button>
                  </div>

                  {/* Card body */}
                  <div className="p-5 space-y-5">
                    {/* Description */}
                    <div>
                      <p className="ds-body" style={{ color: textColor, lineHeight: '1.6' }}>
                        {selectedMeta.description}
                      </p>
                    </div>

                    {/* Timeline info */}
                    <div
                      className="px-4 py-3 rounded"
                      style={{ borderLeft: `3px solid ${urgencyColor}`, backgroundColor: '#F5F5F5' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="ds-label" style={{ color: mutedColor }}>Time Remaining</span>
                        <span className="ds-label font-semibold" style={{ color: urgencyColor }}>
                          {weeksLeft} weeks
                        </span>
                      </div>
                      <p className="ds-small" style={{ color: mutedColor }}>
                        {urgency === 'urgent'
                          ? URGENCY_MESSAGES.urgent
                          : urgency === 'moderate'
                          ? URGENCY_MESSAGES.moderate
                          : URGENCY_MESSAGES.calm}
                      </p>
                    </div>

                    {/* Tasks */}
                    {tasks.length > 0 && (
                      <div>
                        <p className="ds-label font-semibold mb-3" style={{ color: textColor }}>
                          Next Steps
                        </p>
                        <div className="space-y-2">
                          {tasks.map((task, ti) => {
                            const key     = `${selectedStage.id}-${ti}`
                            const checked = checkedTasks[key] ?? false
                            return (
                              <button
                                key={key}
                                onClick={() => toggleTask(key)}
                                className="w-full text-left flex items-start gap-3 p-2 rounded transition-colors hover:bg-gray-50"
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  cursor: 'pointer',
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  readOnly
                                  className="mt-0.5"
                                  style={{ cursor: 'pointer' }}
                                />
                                <span
                                  className="ds-small"
                                  style={{
                                    color: checked ? mutedColor : textColor,
                                    textDecoration: checked ? 'line-through' : 'none',
                                  }}
                                >
                                  {task}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* AI next action */}
                    {isActiveSelected && (
                      <ActionCard
                        stage={selectedMeta?.label ?? selectedStage.id}
                        topic={intake.topic}
                        university={intake.university}
                        deadline={intake.deadline}
                        weeksLeft={weeksLeft}
                        urgency={urgency}
                      />
                    )}

                    {/* Recommended Topics (Orientation & Apply Jobs stages) */}
                    {recommendations.topics.length > 0 && (
                      <div className="space-y-2">
                        <p className="ds-label font-semibold" style={{ color: textColor }}>
                          {selectedStage?.id === 'apply_jobs' ? 'Job Opportunities' : 'Suggested Topics'}
                        </p>
                        <div className="space-y-2">
                          {recommendations.topics.slice(0, 3).map((rec) => (
                            <div
                              key={rec.topic.id}
                              className="rounded px-3 py-2 cursor-pointer transition-colors hover:bg-blue-50"
                              style={{
                                backgroundColor: '#F5F5F5',
                                border: `1px solid ${borderColor}`,
                              }}
                            >
                              <p className="ds-small font-medium" style={{ color: textColor }}>
                                {rec.topic.title.slice(0, 40)}...
                              </p>
                              <p className="ds-caption mt-1" style={{ color: mutedColor }}>
                                {rec.relevance}
                              </p>
                              {rec.employmentSignal && (
                                <span
                                  className="ds-caption inline-block mt-2 px-2 py-1 rounded"
                                  style={{
                                    backgroundColor:
                                      rec.employmentSignal === 'yes'
                                        ? '#D4EDDA'
                                        : rec.employmentSignal === 'open'
                                          ? '#FFF3CD'
                                          : '#E7E7E7',
                                    color:
                                      rec.employmentSignal === 'yes'
                                        ? '#155724'
                                        : rec.employmentSignal === 'open'
                                          ? '#856404'
                                          : '#666',
                                  }}
                                >
                                  {rec.employmentSignal === 'yes'
                                    ? '💼 Employment'
                                    : rec.employmentSignal === 'open'
                                      ? '🔄 Open'
                                      : 'Academic'}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommended Supervisors & Experts */}
                    {(recommendations.supervisors.length > 0 || recommendations.experts.length > 0) && (
                      <div className="space-y-2">
                        <p className="ds-label font-semibold" style={{ color: textColor }}>
                          Recommended Contacts
                        </p>
                        <div className="space-y-2">
                          {recommendations.supervisors.slice(0, 2).map((rec) => (
                            <div
                              key={rec.supervisor.id}
                              className="rounded px-3 py-2"
                              style={{
                                backgroundColor: '#F5F5F5',
                                border: `1px solid ${borderColor}`,
                              }}
                            >
                              <p className="ds-small font-medium" style={{ color: textColor }}>
                                {rec.supervisor.title} {rec.supervisor.firstName}
                              </p>
                              <p className="ds-caption" style={{ color: mutedColor }}>
                                {rec.fieldMatch.map(getFieldName).join(' • ')}
                              </p>
                              <p className="ds-caption mt-1" style={{ color: mutedColor }}>
                                {rec.relevance}
                              </p>
                            </div>
                          ))}
                          {recommendations.experts.slice(0, 2).map((rec) => (
                            <div
                              key={rec.expert.id}
                              className="rounded px-3 py-2"
                              style={{
                                backgroundColor: '#F5F5F5',
                                border: `1px solid ${borderColor}`,
                              }}
                            >
                              <p className="ds-small font-medium" style={{ color: textColor }}>
                                {rec.expert.firstName} {rec.expert.lastName}
                              </p>
                              <p className="ds-caption" style={{ color: mutedColor }}>
                                {rec.fieldMatch.map(getFieldName).join(' • ')}
                              </p>
                              <p className="ds-caption mt-1" style={{ color: mutedColor }}>
                                {rec.relevance}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommended Similar Projects */}
                    {recommendations.similarProjects.length > 0 && (
                      <div className="space-y-2">
                        <p className="ds-label font-semibold" style={{ color: textColor }}>
                          Similar Projects
                        </p>
                        <div className="space-y-2">
                          {recommendations.similarProjects.slice(0, 2).map((rec) => (
                            <div
                              key={rec.project.id}
                              className="rounded px-3 py-2"
                              style={{
                                backgroundColor: '#F5F5F5',
                                border: `1px solid ${borderColor}`,
                              }}
                            >
                              <p className="ds-small font-medium" style={{ color: textColor }}>
                                {rec.project.title.slice(0, 35)}...
                              </p>
                              <p className="ds-caption mt-1" style={{ color: mutedColor }}>
                                Status: <strong>{rec.project.state}</strong>
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested contacts based on field overlap */}
                    {isActiveSelected && (topSupervisors.length > 0 || topExperts.length > 0) && (
                      <div className="space-y-2">
                        <p className="ds-label font-semibold" style={{ color: textColor }}>
                          Suggested contacts
                        </p>

                        {topSupervisors.map(({ supervisor, overlappingFields }) => (
                          <div
                            key={supervisor.id}
                            className="rounded px-3 py-2"
                            style={{ backgroundColor: '#F5F5F5', border: `1px solid ${borderColor}` }}
                          >
                            <p className="ds-small font-medium" style={{ color: textColor }}>
                              {supervisor.title} {supervisor.firstName} {supervisor.lastName}
                            </p>
                            <p className="ds-caption" style={{ color: mutedColor }}>
                              {getUniversityName(supervisor.universityId)}
                            </p>
                            {overlappingFields.length > 0 && (
                              <p className="ds-caption mt-1" style={{ color: mutedColor }}>
                                Match: {overlappingFields.map(getFieldName).join(', ')}
                              </p>
                            )}
                          </div>
                        ))}

                        {topExperts.map(({ expert, overlappingFields }) => (
                          <div
                            key={expert.id}
                            className="rounded px-3 py-2"
                            style={{ backgroundColor: '#F5F5F5', border: `1px solid ${borderColor}` }}
                          >
                            <p className="ds-small font-medium" style={{ color: textColor }}>
                              {expert.firstName} {expert.lastName}
                            </p>
                            <p className="ds-caption" style={{ color: mutedColor }}>
                              {expert.title} · {expert.companyName}
                            </p>
                            {overlappingFields.length > 0 && (
                              <p className="ds-caption mt-1" style={{ color: mutedColor }}>
                                Match: {overlappingFields.map(getFieldName).join(', ')}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action buttons */}
                    {isActiveSelected && activeStage && (
                      <div
                        className="sticky bottom-0 flex gap-2 flex-wrap border-t"
                        style={{
                          borderColor,
                          paddingTop: 12,
                          marginTop: 8,
                          backgroundColor: bgColor,
                          paddingBottom: 4,
                        }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { markStageDone(activeStage.id); setSelectedStageId(null) }}
                          className="flex-1 ds-label py-2 px-4 font-semibold rounded transition-colors"
                          style={{
                            backgroundColor: accentBlue,
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Mark as Done
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onStuck(activeStage.id)}
                          className="flex-1 ds-label py-2 px-4 rounded transition-colors"
                          style={{
                            backgroundColor: 'transparent',
                            color: accentBlue,
                            border: `1px solid ${borderColor}`,
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F5F5' }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                        >
                          I'm Stuck
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

        {/* ── Right Sidebar: Navigator, Current Phase, Milestones ── */}
        <div
          className="hidden lg:flex flex-col flex-shrink-0 overflow-y-auto bg-gray-50"
          style={{ width: 280, borderLeft: `1px solid ${borderColor}` }}
        >
          {/* Navigator Header */}
          <div className="px-5 pt-4 pb-3 border-b" style={{ borderColor }}>
            <div className="flex items-center gap-2 mb-1">
              <Compass size={16} color={accentBlue} strokeWidth={2} />
              <span className="ds-label font-semibold" style={{ color: textColor }}>Navigator</span>
            </div>
            <p className="ds-caption" style={{ color: mutedColor }}>Thesis GPS</p>
          </div>

          {/* Current Phase */}
          {activeStage && (() => {
            const activeMeta = STAGES.find((s) => s.id === activeStage.id)
            return (
              <div className="px-5 py-4 border-b" style={{ borderColor }}>
                <p className="ds-label font-semibold mb-3" style={{ color: textColor }}>Current Phase</p>
                <div
                  className="p-3 rounded"
                  style={{ border: `1px solid ${borderColor}`, backgroundColor: bgColor }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: accentBlue, flexShrink: 0 }}
                    />
                    <span className="ds-label font-semibold" style={{ color: accentBlue }}>
                      {activeMeta?.label ?? activeStage.id}
                    </span>
                  </div>
                  <p className="ds-small mb-3" style={{ color: mutedColor, lineHeight: 1.5 }}>
                    {activeMeta?.description ?? ''}
                  </p>
                  <button
                    onClick={() => setSelectedStageId(activeStage.id)}
                    className="w-full ds-small py-2 font-semibold rounded transition-colors"
                    style={{
                      backgroundColor: 'transparent',
                      color: accentBlue,
                      border: `1px solid ${accentBlue}`,
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(37, 99, 235, 0.05)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            )
          })()}

          {/* Milestones */}
          <div className="px-5 py-4 flex-1">
            <p className="ds-label font-semibold mb-3" style={{ color: textColor }}>Milestones</p>
            <div className="space-y-1">
              {visibleMilestones.map((st, i) => {
                const meta   = STAGES.find((s) => s.id === st.id)
                const isDone = st.status === 'done'
                const isAct  = st.status === 'active'
                return (
                  <motion.div
                    key={st.id}
                    custom={i}
                    variants={sidebarItem}
                    initial="hidden"
                    animate="visible"
                    onClick={() => setSelectedStageId((prev) => prev === st.id ? null : st.id)}
                    className="flex items-start gap-3 px-3 py-2 rounded cursor-pointer transition-colors"
                    style={{
                      backgroundColor: selectedStageId === st.id ? '#E8F0FE' : 'transparent',
                    }}
                    onMouseEnter={(e) => { if (selectedStageId !== st.id) (e.currentTarget as HTMLElement).style.backgroundColor = '#F0F0F0' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = selectedStageId === st.id ? '#E8F0FE' : 'transparent' }}
                  >
                    {/* Icon */}
                    <div style={{ flexShrink: 0, marginTop: 2 }}>
                      {isDone ? (
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: accentBlue,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={12} color="white" strokeWidth={3} />
                        </div>
                      ) : isAct ? (
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            border: `2px solid ${accentBlue}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: accentBlue,
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            border: `2px solid ${borderColor}`,
                          }}
                        />
                      )}
                    </div>
                    {/* Label */}
                    <div>
                      <p
                        className="ds-small font-medium"
                        style={{
                          color: isAct ? accentBlue : isDone ? mutedColor : textColor,
                          textDecoration: isDone ? 'line-through' : 'none',
                        }}
                      >
                        {meta?.label ?? st.id}
                      </p>
                      <p className="ds-caption" style={{ color: mutedColor, marginTop: 2 }}>
                        {isAct ? 'Active' : isDone ? 'Completed' : 'Locked'}
                      </p>
                    </div>
                  </motion.div>
                )
              })}

              {urgency === 'urgent' && remainingNotStarted > 0 && (
                <div
                  className="px-3 py-2 rounded"
                  style={{ border: `1px dashed ${borderColor}`, backgroundColor: '#FFFFFF' }}
                >
                  <p className="ds-small" style={{ color: mutedColor }}>
                    {remainingNotStarted} stages remaining - focus on what's in front of you
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Topographic node map ───────────────────────────────────────────

function NodeMap({ stages, onSelect }: { stages: StageState[]; onSelect: (id: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ w: 800, h: 500 })
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({})
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ id: string; startX: number; startY: number; baseX: number; baseY: number } | null>(null)
  const panRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null)
  const didDrag = useRef(false)
  const didPan = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const w = el.offsetWidth, h = el.offsetHeight
      setContainerSize({ w, h })
      setPositions(prev => {
        const next: Record<string, { x: number; y: number }> = {}
        NODE_POSITIONS.forEach(n => {
          next[n.id] = prev[n.id] ?? { x: (n.x / 240) * w, y: (n.y / 150) * h }
        })
        return next
      })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const stageStatusMap: Record<string, string> = {}
  stages.forEach((s) => { stageStatusMap[s.id] = s.status })

  const points = NODE_POSITIONS.map((n) => ({
    ...n,
    status: stageStatusMap[n.id] ?? 'not_started',
    pos: positions[n.id] ?? { x: (n.x / 240) * containerSize.w, y: (n.y / 150) * containerSize.h },
  }))

  const segments = points.slice(0, -1).flatMap((from, i) => {
    if (from.status !== 'done') return []
    const to   = points[i + 1]
    const cp1x = from.pos.x + (to.pos.x - from.pos.x) * 0.45
    const cp2x = to.pos.x   - (to.pos.x - from.pos.x) * 0.45
    return [`M ${from.pos.x} ${from.pos.y} C ${cp1x} ${from.pos.y}, ${cp2x} ${to.pos.y}, ${to.pos.x} ${to.pos.y}`]
  })

  // ── Node drag handlers ──
  function handleNodePointerDown(e: React.PointerEvent<HTMLButtonElement>, id: string) {
    e.currentTarget.setPointerCapture(e.pointerId)
    e.stopPropagation()
    didDrag.current = false
    const pos = positions[id] ?? { x: 0, y: 0 }
    dragRef.current = { id, startX: e.clientX, startY: e.clientY, baseX: pos.x, baseY: pos.y }
  }

  function handleNodePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!dragRef.current) return
    const { id, startX, startY, baseX, baseY } = dragRef.current
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.current = true
    setPositions(prev => ({ ...prev, [id]: { x: baseX + dx, y: baseY + dy } }))
  }

  function handleNodePointerUp(e: React.PointerEvent<HTMLButtonElement>, id: string) {
    e.stopPropagation()
    dragRef.current = null
    if (!didDrag.current) onSelect(id)
    didDrag.current = false
  }

  // ── Map pan handlers (fires on background, not on nodes thanks to stopPropagation) ──
  function handleMapPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    didPan.current = false
    panRef.current = { startX: e.clientX, startY: e.clientY, baseX: pan.x, baseY: pan.y }
  }

  function handleMapPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!panRef.current) return
    const dx = e.clientX - panRef.current.startX
    const dy = e.clientY - panRef.current.startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didPan.current = true
    setPan({ x: panRef.current.baseX + dx, y: panRef.current.baseY + dy })
  }

  function handleMapPointerUp() {
    panRef.current = null
  }

  const accentBlue = '#2563EB'
  const borderColor = '#ECECEC'
  const mutedColor = '#808080'

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ padding: 24 }}
    >
      <div
        ref={containerRef}
        className="rounded-lg"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          border: `1px solid ${borderColor}`,
          overflow: 'hidden',
          backgroundColor: '#FAFAFA',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        {/* Base texture layer */}
        <img
          src={mapImage}
          alt="base map texture"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: 0.22,
            position: 'absolute',
            inset: 0,
          }}
        />

        {/* Primary contour layer with stronger visibility */}
        <img
          src={contourMapImage}
          alt="topographic contour map"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: 0.22,
            position: 'absolute',
            inset: 0,
            mixBlendMode: 'multiply',
            filter: 'contrast(1.35) brightness(0.88) saturate(0.75)',
          }}
        />

        {/* Readability veil so nodes and labels stay clear */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.3) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Pannable layer: SVG lines + nodes */}
        <div
          onPointerDown={handleMapPointerDown}
          onPointerMove={handleMapPointerMove}
          onPointerUp={handleMapPointerUp}
          style={{
            position: 'absolute',
            inset: 0,
            cursor: panRef.current ? 'grabbing' : 'grab',
            zIndex: 1,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translate(${pan.x}px, ${pan.y}px)`,
              willChange: 'transform',
            }}
          >
            {/* SVG lines — connect completed stages */}
            <svg
              viewBox={`0 0 ${containerSize.w} ${containerSize.h}`}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              {segments.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={accentBlue}
                  strokeWidth="2"
                  opacity={0.3}
                  strokeLinecap="round"
                />
              ))}
            </svg>

            {/* Nodes */}
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {points.map((p) => {
                const isDone = p.status === 'done'
                const isAct  = p.status === 'active'
                const Icon   = STAGE_ICONS[p.id as StageId]
                return (
                  <div
                    key={p.id}
                    style={{
                      position: 'absolute',
                      left: p.pos.x,
                      top:  p.pos.y,
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      userSelect: 'none',
                    }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.95 }}
                      onPointerDown={(e) => handleNodePointerDown(e, p.id)}
                      onPointerMove={handleNodePointerMove}
                      onPointerUp={(e) => handleNodePointerUp(e, p.id)}
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: isAct ? accentBlue : isDone ? '#BFDBFE' : '#FFFFFF',
                    border: `2px solid ${isAct ? accentBlue : isDone ? accentBlue : borderColor}`,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'grab',
                    touchAction: 'none',
                    boxShadow: isAct
                      ? `0 0 0 6px rgba(37, 99, 235, 0.1), 0 2px 8px rgba(0,0,0,0.1)`
                      : isDone
                      ? '0 1px 4px rgba(0,0,0,0.08)'
                      : '0 1px 3px rgba(0,0,0,0.06)',
                    opacity: isAct ? 1 : isDone ? 0.85 : 0.6,
                  }}
                >
                  {isDone ? (
                    <Check size={18} color={accentBlue} strokeWidth={2.5} />
                  ) : (
                    <Icon
                      size={18}
                      color={isAct ? '#FFFFFF' : mutedColor}
                      strokeWidth={2}
                    />
                  )}
                </motion.button>
                <span
                  className="ds-caption font-medium"
                  style={{
                    color: isAct ? accentBlue : isDone ? accentBlue : mutedColor,
                    opacity: isAct ? 1 : isDone ? 0.7 : 0.5,
                    pointerEvents: 'none',
                    backgroundColor: '#FFFFFF',
                    padding: '2px 5px',
                    borderRadius: 3,
                    border: `1px solid ${borderColor}`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.stageName}
                </span>
              </div>
            )
          })}
            </div>{/* /nodes */}
          </div>{/* /transform */}
        </div>{/* /pannable */}
      </div>{/* /containerRef */}
    </div>
  )
}
