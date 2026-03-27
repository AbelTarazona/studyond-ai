import { useState, useMemo } from 'react'
import { Loader2, BookOpen } from 'lucide-react'
import { topics as allTopics } from '@/data'
import type { Topic } from '@/data'

interface LiteratureScopeItem {
  area: string
  description: string
  keyTerms: string
}

interface OrientationWorkspaceProps {
  topic: string
  borderColor: string
  textColor: string
  mutedColor: string
  accentBlue: string
}

const EMPLOYMENT_LABEL: Record<string, string> = {
  yes: '💼 Employment',
  open: '🔄 Open',
  no: 'Academic',
}

const EMPLOYMENT_STYLE: Record<string, { backgroundColor: string; color: string }> = {
  yes:  { backgroundColor: '#D4EDDA', color: '#155724' },
  open: { backgroundColor: '#FFF3CD', color: '#856404' },
  no:   { backgroundColor: '#E7E7E7', color: '#666' },
}

function scoreTopicByQuery(topic: Topic, query: string): number {
  if (!query.trim()) return topic.employment === 'yes' ? 2 : topic.employment === 'open' ? 1 : 0
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
  if (words.length === 0) return 0
  const haystack = `${topic.title} ${topic.description}`.toLowerCase()
  return words.reduce((acc, w) => acc + (haystack.includes(w) ? 1 : 0), 0)
}

export function OrientationWorkspace({
  topic,
  borderColor,
  textColor,
  mutedColor,
  accentBlue,
}: OrientationWorkspaceProps) {
  const [researchQuestion, setResearchQuestion] = useState(topic)
  const [scopes, setScopes] = useState<LiteratureScopeItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generated, setGenerated] = useState(false)

  const matchedTopics = useMemo(() => {
    return (allTopics as Topic[])
      .map((t) => ({ topic: t, score: scoreTopicByQuery(t, researchQuestion) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }, [researchQuestion])

  async function generateLiteratureScope() {
    if (!researchQuestion.trim()) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 700,
          system: "You are an academic thesis advisor helping master's and PhD students scope their literature review. Return only valid JSON, no markdown.",
          messages: [{
            role: 'user',
            content: `Research question: "${researchQuestion}"

Suggest 4 focused literature scope areas for this thesis. Return JSON:
{
  "scopes": [
    { "area": "Area name", "description": "1-2 sentences on what to cover in this area", "keyTerms": "term1, term2, term3" }
  ]
}`,
          }],
        }),
      })

      const data = await res.json()
      const text = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? ''
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        const parsed = JSON.parse(match[0])
        setScopes(parsed.scopes ?? [])
        setGenerated(true)
      } else {
        setError('Could not parse response.')
      }
    } catch {
      setError('Could not generate literature scope. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* ── Research Question ── */}
      <div className="space-y-2">
        <p className="ds-label font-semibold" style={{ color: textColor }}>Research Question</p>
        <p className="ds-caption" style={{ color: mutedColor }}>
          Define your core research question to guide your thesis journey.
        </p>
        <textarea
          value={researchQuestion}
          onChange={(e) => setResearchQuestion(e.target.value)}
          rows={3}
          placeholder="e.g. How does federated learning impact privacy in healthcare data management?"
          className="w-full rounded-lg p-3 ds-small resize-none"
          style={{
            border: `1px solid ${borderColor}`,
            outline: 'none',
            color: textColor,
            backgroundColor: '#FFFFFF',
            lineHeight: 1.6,
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = accentBlue }}
          onBlur={(e) => { e.currentTarget.style.borderColor = borderColor }}
        />
        <button
          onClick={generateLiteratureScope}
          disabled={loading || !researchQuestion.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg ds-small font-semibold"
          style={{
            backgroundColor: accentBlue,
            color: '#FFFFFF',
            border: 'none',
            cursor: loading || !researchQuestion.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !researchQuestion.trim() ? 0.6 : 1,
          }}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <BookOpen size={14} />}
          {loading ? 'Generating…' : 'Suggest Literature Scope'}
        </button>
      </div>

      {/* ── AI Literature Scope ── */}
      {(generated || loading) && (
        <div className="space-y-3">
          <p className="ds-label font-semibold" style={{ color: textColor }}>Literature Scope</p>

          {loading && (
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg p-3 animate-pulse"
                  style={{ border: `1px solid ${borderColor}`, backgroundColor: '#F5F5F5' }}
                >
                  <div className="h-3 w-1/3 rounded bg-gray-200 mb-2" />
                  <div className="h-3 w-full rounded bg-gray-200" />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <p className="ds-small" style={{ color: '#E63946' }}>{error}</p>
          )}

          {!loading && scopes.length > 0 && (
            <div className="space-y-2">
              {scopes.map((scope, i) => (
                <article
                  key={i}
                  className="rounded-lg p-3"
                  style={{ border: `1px solid ${accentBlue}33`, backgroundColor: '#F8FAFF' }}
                >
                  <p className="ds-small font-semibold" style={{ color: accentBlue }}>{scope.area}</p>
                  <p className="ds-caption mt-1" style={{ color: textColor, lineHeight: 1.5 }}>{scope.description}</p>
                  <p className="ds-caption mt-2" style={{ color: mutedColor }}>Key terms: {scope.keyTerms}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Recommended Topics from topics.json ── */}
      <div className="space-y-3">
        <p className="ds-label font-semibold" style={{ color: textColor }}>Recommended Topics</p>
        <p className="ds-caption" style={{ color: mutedColor }}>
          {researchQuestion.trim()
            ? 'Matching topics from the platform based on your research question.'
            : 'Top topics by employment signal. Refine by typing your research question above.'}
        </p>

        {matchedTopics.length === 0 ? (
          <p className="ds-small" style={{ color: mutedColor }}>
            No topics matched. Try different keywords in your research question.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {matchedTopics.map(({ topic: t }) => (
              <article
                key={t.id}
                className="rounded-lg p-3 flex flex-col gap-2"
                style={{ border: `1px solid ${borderColor}`, backgroundColor: '#FFFFFF' }}
              >
                <p className="ds-small font-semibold" style={{ color: textColor }}>{t.title}</p>
                <p className="ds-caption" style={{ color: mutedColor, lineHeight: 1.5 }}>
                  {t.description.slice(0, 120)}…
                </p>
                {t.employment && (
                  <span
                    className="ds-caption self-start px-2 py-0.5 rounded"
                    style={EMPLOYMENT_STYLE[t.employment] ?? EMPLOYMENT_STYLE.no}
                  >
                    {EMPLOYMENT_LABEL[t.employment] ?? 'Academic'}
                  </span>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
