import { useEffect, useMemo, useState } from 'react'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { ACTION_CARD_PROMPT, SYSTEM_PROMPT_BASE } from '@/lib/prompts'

interface ActionResponse {
  action: string
  rationale: string
  confidence: number
  blockers: string[]
  suggested_contacts: string[]
}

interface ActionCardProps {
  stage: string
  topic: string
  university: string
  deadline: string
  weeksLeft: number
  urgency: 'calm' | 'moderate' | 'urgent'
}

export function ActionCard({ stage, topic, university, deadline, weeksLeft, urgency }: ActionCardProps) {
  const [response, setResponse] = useState<ActionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const prompt = useMemo(
    () => ACTION_CARD_PROMPT({ stage, topic, university, deadline, weeksLeft, urgency }),
    [deadline, stage, topic, university, urgency, weeksLeft]
  )

  useEffect(() => {
    let cancelled = false

    async function generateAction() {
      if (!deadline) {
        setResponse(null)
        return
      }

      setLoading(true)
      setError(null)
      setResponse(null)

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
            max_tokens: 500,
            system: SYSTEM_PROMPT_BASE,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
          }),
        })

        const data = await res.json()
        const text = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? ''

        if (!cancelled) {
          try {
            // Extract JSON from response (in case Claude adds markdown wrapping)
            const jsonMatch = text.match(/\{[\s\S]*\}/)
            const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null
            
            if (parsed && parsed.action && parsed.rationale) {
              setResponse({
                action: parsed.action,
                rationale: parsed.rationale,
                confidence: Math.max(0, Math.min(100, parsed.confidence ?? 75)),
                blockers: Array.isArray(parsed.blockers) ? parsed.blockers : [],
                suggested_contacts: Array.isArray(parsed.suggested_contacts) ? parsed.suggested_contacts : [],
              })
            } else {
              setError('Response format invalid')
            }
          } catch {
            setError('Could not parse response')
          }
        }
      } catch {
        if (!cancelled) {
          setError('Could not generate your next action right now.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    generateAction()

    return () => {
      cancelled = true
    }
  }, [prompt, deadline])

  if (!loading && !response && !error) {
    return null
  }

  const confidenceColor = response
    ? response.confidence >= 75
      ? 'text-green-600'
      : response.confidence >= 50
        ? 'text-amber-600'
        : 'text-orange-600'
    : ''

  return (
    <div className="border border-ai rounded-xl p-4 bg-blue-50/40">
      <p className="ds-caption text-ai mb-3 font-medium">What to do right now</p>

      {loading && (
        <div className="space-y-3" aria-live="polite" aria-busy="true">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="ds-small">Planning your next move...</span>
          </div>
          <div className="h-3 w-5/6 rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-4/5 rounded bg-muted" />
        </div>
      )}

      {!loading && response && (
        <div className="space-y-3">
          {/* Action */}
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="ds-small font-semibold text-foreground">{response.action}</p>
              <p className="ds-small text-muted-foreground mt-1">{response.rationale}</p>
            </div>
          </div>

          {/* Confidence */}
          <div className="flex items-center gap-2 pt-2">
            <span className="ds-small text-muted-foreground">Confidence:</span>
            <div className="w-full max-w-xs bg-muted rounded-full h-2">
              <div
                className={`h-full rounded-full transition-all ${
                  response.confidence >= 75
                    ? 'bg-green-500'
                    : response.confidence >= 50
                      ? 'bg-amber-500'
                      : 'bg-orange-500'
                }`}
                style={{ width: `${response.confidence}%` }}
              />
            </div>
            <span className={`ds-small font-semibold ${confidenceColor}`}>{response.confidence}%</span>
          </div>

          {/* Blockers */}
          {response.blockers.length > 0 && (
            <div className="flex items-start gap-2 pt-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="ds-small font-semibold text-foreground">Potential blockers:</p>
                <ul className="ds-small text-muted-foreground mt-1 space-y-1">
                  {response.blockers.map((blocker, i) => (
                    <li key={i} className="ml-3">• {blocker}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Suggested Contacts */}
          {response.suggested_contacts.length > 0 && (
            <div className="pt-2 border-t border-border">
              <p className="ds-small font-semibold text-foreground mb-2">Suggested contacts:</p>
              <p className="ds-small text-muted-foreground">
                {response.suggested_contacts.join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      {!loading && error && (
        <p className="ds-small text-destructive">{error}</p>
      )}
    </div>
  )
}

