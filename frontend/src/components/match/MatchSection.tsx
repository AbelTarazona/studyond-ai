import { useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, Mail } from 'lucide-react'
import { MATCH } from '@/lib/copy'
import { getFieldName, getUniversityName } from '@/data'
import { useMatches } from '@/hooks/useMatches'
import { OutreachDialog } from '@/components/outreach/OutreachDialog'

interface MatchSectionProps {
  studentFieldIds: string[]
  studentTopic: string
  studentName?: string
}

export function MatchSection({ studentFieldIds, studentTopic, studentName = 'Student' }: MatchSectionProps) {
  const { topSupervisors, topExperts } = useMatches(studentFieldIds)
  const [outreachTarget, setOutreachTarget] = useState<{
    name: string
    role: string
    org: string
    matchReason: string
  } | null>(null)

  if (!topSupervisors.length && !topExperts.length) return null

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16">
      <h2 className="ds-title-md mb-6">{MATCH.sectionTitle}</h2>

      <div className="space-y-3">
        {topSupervisors.map(({ supervisor, score, overlappingFields }, i) => (
          <motion.div
            key={supervisor.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="border border-border rounded-2xl p-5 hover:border-muted-foreground transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="ds-title-cards">
                      {supervisor.title} {supervisor.firstName} {supervisor.lastName}
                    </p>
                    <span className="ds-badge px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      {MATCH.supervisorBadge}
                    </span>
                  </div>
                  <p className="ds-small text-muted-foreground">{getUniversityName(supervisor.universityId)}</p>
                </div>
              </div>
              <span className="ds-label font-medium text-ai-solid flex-shrink-0">
                {MATCH.fitLabel(score)}
              </span>
            </div>

            {/* Why they match */}
            <p className="ds-small text-muted-foreground mt-3 mb-3">
              {supervisor.about}
            </p>

            {/* Overlapping fields */}
            {overlappingFields.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {overlappingFields.map((f) => (
                  <span
                    key={f}
                    className="ds-badge px-2.5 py-1 rounded-full border border-ai bg-blue-50/50 text-blue-700"
                  >
                    {getFieldName(f)}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() =>
                setOutreachTarget({
                  name: `${supervisor.title} ${supervisor.firstName} ${supervisor.lastName}`,
                  role: 'Supervisor',
                  org: getUniversityName(supervisor.universityId),
                  matchReason: `Overlapping research interests in: ${overlappingFields.map(getFieldName).join(', ')}`,
                })
              }
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-full ds-small hover:border-foreground transition-all duration-200"
            >
              <Mail className="w-3.5 h-3.5" />
              {MATCH.outreachButton}
            </button>
          </motion.div>
        ))}

        {topExperts.map(({ expert, score, overlappingFields }, i) => (
          <motion.div
            key={expert.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (topSupervisors.length + i) * 0.06 }}
            className="border border-border rounded-2xl p-5 hover:border-muted-foreground transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="ds-title-cards">
                      {expert.firstName} {expert.lastName}
                    </p>
                    <span className="ds-badge px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      {MATCH.expertBadge}
                    </span>
                    {expert.offerInterviews && (
                      <span className="ds-badge px-2 py-0.5 rounded-full border border-ai text-blue-700">
                        Open to interviews
                      </span>
                    )}
                  </div>
                  <p className="ds-small text-muted-foreground">
                    {expert.title} · {expert.companyName}
                  </p>
                </div>
              </div>
              <span className="ds-label font-medium text-ai-solid flex-shrink-0">
                {MATCH.fitLabel(score)}
              </span>
            </div>

            <p className="ds-small text-muted-foreground mt-3 mb-3">{expert.about}</p>

            {overlappingFields.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {overlappingFields.map((f) => (
                  <span
                    key={f}
                    className="ds-badge px-2.5 py-1 rounded-full border border-ai bg-blue-50/50 text-blue-700"
                  >
                    {getFieldName(f)}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() =>
                setOutreachTarget({
                  name: `${expert.firstName} ${expert.lastName}`,
                  role: expert.title,
                  org: expert.companyName,
                  matchReason: `Shared expertise in: ${overlappingFields.map(getFieldName).join(', ')}`,
                })
              }
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-full ds-small hover:border-foreground transition-all duration-200"
            >
              <Mail className="w-3.5 h-3.5" />
              {MATCH.outreachButton}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Outreach dialog */}
      {outreachTarget && (
        <OutreachDialog
          studentName={studentName}
          studentTopic={studentTopic}
          recipientName={outreachTarget.name}
          recipientRole={outreachTarget.role}
          recipientOrg={outreachTarget.org}
          matchReason={outreachTarget.matchReason}
          onClose={() => setOutreachTarget(null)}
        />
      )}
    </div>
  )
}
