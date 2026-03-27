import { useMemo } from 'react'
import { experts, getUniversityName } from '@/data'

interface ApplicationWorkspaceProps {
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
  borderColor: string
  textColor: string
  mutedColor: string
  accentBlue: string
}

type TrackOption = {
  key: string
  label: string
  score: number
  topics: string[]
}

function resolveCompanyName(companyId: string | null): string {
  if (!companyId) return 'Unknown Company'
  const expert = experts.find((e) => e.companyId === companyId)
  return expert?.companyName ?? companyId
}

export function ApplicationWorkspace({
  topic,
  applicationRecommendations,
  borderColor,
  textColor,
  mutedColor,
  accentBlue,
}: ApplicationWorkspaceProps) {
  const companyTracks = useMemo<TrackOption[]>(() => {
    const grouped = new Map<string, TrackOption>()

    applicationRecommendations.topics
      .filter((r) => r.topic.companyId)
      .forEach((rec) => {
        const companyId = rec.topic.companyId as string
        const label = resolveCompanyName(companyId)
        const existing = grouped.get(companyId)
        if (existing) {
          existing.score += rec.score
          existing.topics.push(rec.topic.title)
        } else {
          grouped.set(companyId, {
            key: companyId,
            label,
            score: rec.score,
            topics: [rec.topic.title],
          })
        }
      })

    return Array.from(grouped.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
  }, [applicationRecommendations.topics])

  const universityTracks = useMemo<TrackOption[]>(() => {
    const grouped = new Map<string, TrackOption>()

    applicationRecommendations.topics
      .filter((r) => r.topic.universityId)
      .forEach((rec) => {
        const universityId = rec.topic.universityId as string
        const label = getUniversityName(universityId)
        const existing = grouped.get(universityId)
        if (existing) {
          existing.score += rec.score
          existing.topics.push(rec.topic.title)
        } else {
          grouped.set(universityId, {
            key: universityId,
            label,
            score: rec.score,
            topics: [rec.topic.title],
          })
        }
      })

    return Array.from(grouped.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
  }, [applicationRecommendations.topics])

  const bestCompany = companyTracks[0]
  const bestUniversity = universityTracks[0]

  const bestPathSummary = useMemo(() => {
    if (!bestCompany && !bestUniversity) {
      return 'No strong application match yet. Refine your topic keywords to unlock clearer recommendations.'
    }

    if (bestCompany && !bestUniversity) {
      return `Recommended path: Company project at ${bestCompany.label}. You currently have the strongest practical-fit score there.`
    }

    if (!bestCompany && bestUniversity) {
      return `Recommended path: University project at ${bestUniversity.label}. This is the strongest academic-fit option based on your topic.`
    }

    if ((bestCompany?.score ?? 0) >= (bestUniversity?.score ?? 0)) {
      return `Recommended path: Company project at ${bestCompany?.label}. This track has a slightly stronger match score than university options right now.`
    }

    return `Recommended path: University project at ${bestUniversity?.label}. This track has the strongest score for your current direction.`
  }, [bestCompany, bestUniversity])

  return (
    <div className="space-y-4">
      <p className="ds-label font-semibold" style={{ color: textColor }}>
        Application Matcher
      </p>
      <p className="ds-caption" style={{ color: mutedColor }}>
        We compare company and university project tracks so you can apply where your fit is strongest.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg p-3" style={{ border: `1px solid ${borderColor}`, backgroundColor: '#FFFFFF' }}>
          <p className="ds-small font-semibold" style={{ color: textColor }}>Best Company Project Tracks</p>
          <div className="mt-2 space-y-2">
            {companyTracks.length === 0 && (
              <p className="ds-caption" style={{ color: mutedColor }}>
                No company matches yet.
              </p>
            )}
            {companyTracks.map((track) => (
              <article key={track.key} className="rounded p-2" style={{ border: `1px solid ${borderColor}`, backgroundColor: '#FAFAFA' }}>
                <p className="ds-small font-medium" style={{ color: textColor }}>{track.label}</p>
                <p className="ds-caption" style={{ color: mutedColor }}>Match score: {Math.round(track.score * 100)}%</p>
                <p className="ds-caption" style={{ color: mutedColor }}>
                  Topics: {track.topics.slice(0, 2).join(' · ')}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-lg p-3" style={{ border: `1px solid ${borderColor}`, backgroundColor: '#FFFFFF' }}>
          <p className="ds-small font-semibold" style={{ color: textColor }}>Best University Project Tracks</p>
          <div className="mt-2 space-y-2">
            {universityTracks.length === 0 && (
              <p className="ds-caption" style={{ color: mutedColor }}>
                No university matches yet.
              </p>
            )}
            {universityTracks.map((track) => (
              <article key={track.key} className="rounded p-2" style={{ border: `1px solid ${borderColor}`, backgroundColor: '#FAFAFA' }}>
                <p className="ds-small font-medium" style={{ color: textColor }}>{track.label}</p>
                <p className="ds-caption" style={{ color: mutedColor }}>Match score: {Math.round(track.score * 100)}%</p>
                <p className="ds-caption" style={{ color: mutedColor }}>
                  Topics: {track.topics.slice(0, 2).join(' · ')}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg p-4" style={{ border: `1px solid ${borderColor}`, backgroundColor: '#F8FAFF' }}>
        <p className="ds-label font-semibold" style={{ color: accentBlue }}>AI Match Summary</p>
        <p className="ds-small mt-2" style={{ color: textColor }}>{bestPathSummary}</p>
        <p className="ds-caption mt-2" style={{ color: mutedColor }}>
          Topic focus: {topic || 'Not provided yet'}
        </p>
      </div>
    </div>
  )
}
