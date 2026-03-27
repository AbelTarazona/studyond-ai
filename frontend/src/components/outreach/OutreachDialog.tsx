import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, Loader2, RefreshCw } from 'lucide-react'
import { OUTREACH } from '@/lib/copy'
import { SYSTEM_PROMPT_BASE, OUTREACH_PROMPT } from '@/lib/prompts'
import { useJourneyStore } from '@/store/journeyStore'
import { STAGES } from '@/lib/copy'

interface OutreachDialogProps {
  studentName: string
  studentTopic: string
  recipientName: string
  recipientRole: string
  recipientOrg: string
  matchReason: string
  onClose: () => void
}

export function OutreachDialog({
  studentName,
  studentTopic,
  recipientName,
  recipientRole,
  recipientOrg,
  matchReason,
  onClose,
}: OutreachDialogProps) {
  const { stages } = useJourneyStore()
  const activeStage = stages.find((s) => s.status === 'active')
  const stageMeta = STAGES.find((s) => s.id === activeStage?.id)

  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateDraft()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function generateDraft() {
    setLoading(true)
    setError(null)
    setDraft(null)

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
          max_tokens: 400,
          system: SYSTEM_PROMPT_BASE,
          messages: [
            {
              role: 'user',
              content: OUTREACH_PROMPT({
                studentName,
                recipientName,
                recipientRole,
                recipientOrg,
                topic: studentTopic,
                matchReason,
                stage: stageMeta?.label ?? 'thesis journey',
              }),
            },
          ],
        }),
      })

      const data = await res.json()
      const raw = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? '{}'
      const clean = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setDraft(parsed)
    } catch {
      setError('Could not generate draft. Check your API key in .env.')
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard() {
    if (!draft) return
    const text = `Subject: ${draft.subject}\n\n${draft.body}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-4 top-16 z-50 mx-auto max-w-lg bg-background border border-border rounded-2xl shadow-lg p-6 max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="ds-title-sm">{OUTREACH.dialogTitle}</h2>
              <p className="ds-small text-muted-foreground mt-0.5">
                To: {recipientName} · {recipientOrg}
              </p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
              <p className="ds-small">Drafting your email...</p>
            </div>
          )}

          {error && (
            <p className="ds-small text-destructive py-4">{error}</p>
          )}

          {draft && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Subject */}
              <div className="mb-4">
                <p className="ds-label text-muted-foreground mb-1">Subject</p>
                <p className="ds-body font-medium">{draft.subject}</p>
              </div>

              {/* Body */}
              <div className="mb-4">
                <p className="ds-label text-muted-foreground mb-1">Body</p>
                <textarea
                  value={draft.body}
                  onChange={(e) => setDraft((d) => d ? { ...d, body: e.target.value } : d)}
                  rows={8}
                  className="w-full border border-border rounded-xl px-4 py-3 ds-small bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <p className="ds-caption text-muted-foreground mb-4">{OUTREACH.editHint}</p>

              <div className="flex gap-2">
                <button
                  onClick={generateDraft}
                  className="flex items-center gap-1.5 px-4 py-2.5 border border-border rounded-full ds-small hover:border-foreground transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {OUTREACH.regenerateButton}
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-foreground text-primary-foreground rounded-full py-2.5 ds-small hover:opacity-80 transition-opacity"
                >
                  {copied ? (
                    <><Check className="w-3.5 h-3.5" />{OUTREACH.copiedButton}</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" />{OUTREACH.copyButton}</>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </>
    </AnimatePresence>
  )
}
