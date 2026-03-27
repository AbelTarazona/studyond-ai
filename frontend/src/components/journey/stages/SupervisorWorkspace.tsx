interface SupervisorWorkspaceProps {
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
  borderColor: string
  textColor: string
  mutedColor: string
  accentBlue: string
}

export function SupervisorWorkspace({
  supervisorRecommendations,
  borderColor,
  textColor,
  mutedColor,
  accentBlue,
}: SupervisorWorkspaceProps) {
  const topCompanies = Array.from(
    new Map(
      supervisorRecommendations.experts
        .filter((r) => r.expert.companyName)
        .map((r) => [r.expert.companyName as string, r])
    ).values()
  ).slice(0, 4)

  const bestCompany = topCompanies[0]
  const runnerUp = topCompanies[1]

  return (
    <div className="space-y-4">
      <p className="ds-label font-semibold" style={{ color: textColor }}>Top Sponsor / Company Matches</p>

      <div className="grid gap-3 md:grid-cols-2">
        {topCompanies.length === 0 && (
          <div className="rounded-lg p-3" style={{ border: `1px solid ${borderColor}`, backgroundColor: '#FFFFFF' }}>
            <p className="ds-small" style={{ color: mutedColor }}>
              Add or refine your topic to unlock stronger company matching.
            </p>
          </div>
        )}

        {topCompanies.map((rec) => (
          <article
            key={rec.expert.id}
            className="rounded-lg p-3"
            style={{ border: `1px solid ${borderColor}`, backgroundColor: '#FFFFFF' }}
          >
            <p className="ds-small font-semibold" style={{ color: textColor }}>
              {rec.expert.companyName}
            </p>
            <p className="ds-caption mt-1" style={{ color: mutedColor }}>
              Contact: {rec.expert.firstName} {rec.expert.lastName} ({rec.expert.title})
            </p>
            <p className="ds-caption mt-1" style={{ color: mutedColor }}>
              Match score: {Math.round(rec.score * 100)}%
            </p>
            <p className="ds-caption mt-1" style={{ color: mutedColor }}>{rec.relevance}</p>
          </article>
        ))}
      </div>

      <div className="rounded-lg p-4" style={{ border: `1px solid ${borderColor}`, backgroundColor: '#F8FAFF' }}>
        <p className="ds-label font-semibold" style={{ color: accentBlue }}>AI Quick Comparison</p>
        <p className="ds-small mt-2" style={{ color: textColor }}>
          {bestCompany
            ? `Best fit right now is ${bestCompany.expert.companyName}. It has the strongest match score (${Math.round(bestCompany.score * 100)}%) and relevant contact availability through ${bestCompany.expert.firstName} ${bestCompany.expert.lastName}.`
            : 'No clear company lead yet. Sharpen your topic title to get a better recommendation.'}
        </p>
        {runnerUp && (
          <p className="ds-small mt-2" style={{ color: mutedColor }}>
            Runner-up: {runnerUp.expert.companyName} (${Math.round(runnerUp.score * 100)}%).
          </p>
        )}
      </div>
    </div>
  )
}
