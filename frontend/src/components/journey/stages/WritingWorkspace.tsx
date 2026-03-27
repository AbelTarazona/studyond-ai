import { useRef, useState } from 'react'
import { Upload, Loader2, RefreshCw, FileText } from 'lucide-react'
import { THESIS_HEALTH_SCORE_PROMPT, SYSTEM_PROMPT_BASE } from '@/lib/prompts'

type ScoreLevel = 'low' | 'medium' | 'high'

interface ThesisProperties {
  title: string | null
  description: string | null
  motivation: string | null
  student: string | null
  topic: string | null
  company: string | null
  university: string | null
  supervisors: string[]
  experts: string[]
  state: 'proposed' | 'applied' | 'agreed' | 'in_progress' | 'completed' | null
}

interface HealthScore {
  properties: ThesisProperties
  clarity: ScoreLevel
  clarity_note: string
  academic_fit: ScoreLevel
  academic_fit_note: string
  method_readiness: ScoreLevel
  method_readiness_note: string
  resources_readiness: ScoreLevel
  resources_readiness_note: string
  supervisor_readiness: ScoreLevel
  supervisor_readiness_note: string
  summary: string
}

interface WritingWorkspaceProps {
  borderColor: string
  textColor: string
  mutedColor: string
  accentBlue: string
}

type MetricKey = 'clarity' | 'academic_fit' | 'method_readiness' | 'resources_readiness' | 'supervisor_readiness'

const METRIC_LABELS: Record<MetricKey, string> = {
  clarity: 'Clarity',
  academic_fit: 'Academic Fit',
  method_readiness: 'Method Readiness',
  resources_readiness: 'Resources Readiness',
  supervisor_readiness: 'Supervisor Readiness',
}

const STATE_LABELS: Record<string, string> = {
  proposed: 'Proposed',
  applied: 'Applied',
  agreed: 'Agreed',
  in_progress: 'In Progress',
  completed: 'Completed',
}

const PROPERTY_ROWS: Array<{ key: keyof ThesisProperties; label: string }> = [
  { key: 'title',        label: 'Title' },
  { key: 'description',  label: 'Description' },
  { key: 'motivation',   label: 'Motivation' },
  { key: 'student',      label: 'Student' },
  { key: 'topic',        label: 'Topic' },
  { key: 'company',      label: 'Company' },
  { key: 'university',   label: 'University' },
  { key: 'supervisors',  label: 'Supervisors' },
  { key: 'experts',      label: 'Experts' },
  { key: 'state',        label: 'State' },
]

const LEVEL_STYLES: Record<ScoreLevel, { bg: string; text: string; dot: string }> = {
  high:   { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  medium: { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400' },
  low:    { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-400'   },
}

export function WritingWorkspace({ borderColor, textColor, mutedColor }: WritingWorkspaceProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [score, setScore] = useState<HealthScore | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setFileName(file.name)
    setScore(null)
    setError(null)
    setLoading(true)

    try {
      // Dynamically import mammoth to keep bundle lean
      const mammoth = await import('mammoth')
      const arrayBuffer = await file.arrayBuffer()
      const { value: documentText } = await mammoth.extractRawText({ arrayBuffer })

      if (!documentText.trim()) {
        setError('Could not extract text from this file. Make sure it is a valid .docx file.')
        setLoading(false)
        return
      }

      const prompt = THESIS_HEALTH_SCORE_PROMPT({ documentText })

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
          max_tokens: 1400,
          system: SYSTEM_PROMPT_BASE,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      const data = await res.json()
      const text = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? ''
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null

      if (
        parsed &&
        parsed.clarity && parsed.academic_fit && parsed.method_readiness &&
        parsed.resources_readiness && parsed.supervisor_readiness
      ) {
        setScore(parsed as HealthScore)
      } else {
        setError('Could not parse the analysis response.')
      }
    } catch {
      setError('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleReset() {
    setFileName(null)
    setScore(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const metrics: MetricKey[] = score
    ? (Object.keys(METRIC_LABELS) as MetricKey[])
    : []

  return (
    <div className="space-y-4 mt-6">
      <p className="ds-label font-semibold" style={{ color: textColor }}>
        Thesis Health Score
      </p>
      <p className="ds-small" style={{ color: mutedColor }}>
        Upload your thesis draft to get a living indicator of your project status.
      </p>

      {/* Upload area */}
      {!score && !loading && (
        <label
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer py-8 px-4 transition-colors hover:bg-blue-50/30"
          style={{ borderColor }}
        >
          <Upload className="w-6 h-6" style={{ color: mutedColor }} />
          <span className="ds-small font-medium" style={{ color: textColor }}>
            {fileName ? fileName : 'Click to upload a .docx file'}
          </span>
          <span className="ds-caption" style={{ color: mutedColor }}>
            Supports Word documents (.docx)
          </span>
          <input
            ref={inputRef}
            type="file"
            accept=".docx"
            className="sr-only"
            onChange={handleInputChange}
          />
        </label>
      )}

      {/* Loading state */}
      {loading && (
        <div
          className="rounded-xl p-5 flex items-center gap-3"
          style={{ border: `1px solid ${borderColor}` }}
        >
          <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" style={{ color: mutedColor }} />
          <div>
            <p className="ds-small font-medium" style={{ color: textColor }}>
              Analyzing your thesis...
            </p>
            <p className="ds-caption" style={{ color: mutedColor }}>
              {fileName}
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="rounded-xl p-4 bg-red-50 border border-red-200">
          <p className="ds-small text-red-700">{error}</p>
          <button
            onClick={handleReset}
            className="ds-caption text-red-600 underline mt-2"
          >
            Try again
          </button>
        </div>
      )}

      {/* Score card */}
      {score && !loading && (
        <div className="rounded-xl p-5 space-y-4 bg-white" style={{ border: `1px solid ${borderColor}` }}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" style={{ color: mutedColor }} />
              <span className="ds-caption font-medium" style={{ color: mutedColor }}>
                {fileName}
              </span>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 ds-caption rounded-md px-2 py-1 transition-colors hover:bg-slate-100"
              style={{ color: mutedColor }}
            >
              <RefreshCw className="w-3 h-3" />
              Re-upload
            </button>
          </div>

          {/* Key Properties */}
          {score.properties && (
            <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
              <div className="px-3 py-2" style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: '#F8F9FA' }}>
                <p className="ds-caption font-semibold" style={{ color: textColor }}>Key Properties</p>
              </div>
              <div className="divide-y" style={{ borderColor }}>
                {PROPERTY_ROWS.map(({ key, label }) => {
                  const val = score.properties[key]
                  const isEmpty = val === null || val === undefined || (Array.isArray(val) && val.length === 0)
                  let display: string
                  if (isEmpty) {
                    display = '—'
                  } else if (Array.isArray(val)) {
                    display = val.join(', ')
                  } else if (key === 'state' && typeof val === 'string') {
                    display = STATE_LABELS[val] ?? val
                  } else {
                    display = String(val)
                  }
                  return (
                    <div key={key} className="grid grid-cols-[140px_1fr] gap-2 px-3 py-2">
                      <span className="ds-caption font-medium" style={{ color: mutedColor }}>{label}</span>
                      <span className="ds-caption" style={{ color: isEmpty ? mutedColor : textColor, opacity: isEmpty ? 0.5 : 1 }}>
                        {display}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {metrics.map((key) => {
              const level = score[key] as ScoreLevel
              const note = score[`${key}_note` as keyof HealthScore] as string | undefined
              const styles = LEVEL_STYLES[level]
              return (
                <div
                  key={key}
                  className={`rounded-lg px-4 py-3 space-y-1.5 ${styles.bg}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`ds-small font-semibold ${styles.text}`}>
                      {METRIC_LABELS[key]}
                    </span>
                    <span className={`flex items-center gap-1.5 ds-caption font-semibold ${styles.text}`}>
                      <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
                      {level}
                    </span>
                  </div>
                  {note && (
                    <p className={`ds-caption leading-snug ${styles.text} opacity-80`}>
                      {note}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Summary */}
          {score.summary && (
            <p className="ds-small pt-1 border-t" style={{ color: mutedColor, borderColor }}>
              {score.summary}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
