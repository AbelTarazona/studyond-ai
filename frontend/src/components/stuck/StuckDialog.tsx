import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { STUCK, STAGES } from '@/lib/copy'
import { STUCK_PROMPT } from '@/lib/prompts'
import { useJourneyStore } from '@/store/journeyStore'
import { askStudyond } from '@/lib/studyond'

interface StuckDialogProps {
  stageId: string | null
  onClose: () => void
}

export function StuckDialog({ stageId, onClose }: StuckDialogProps) {
  const { intake } = useJourneyStore()
  const [blocker, setBlocker] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stageMeta = STAGES.find((s) => s.id === stageId)

  async function handleSubmit() {
    if (!blocker.trim() || !intake) return
    setLoading(true)
    setError(null)

    try {
      const text = await askStudyond(
        STUCK_PROMPT({
          stage: stageMeta?.label ?? stageId ?? '',
          topic: intake.topic,
          blocker,
        })
      )
      setResponse(text)
    } catch {
      setError('Something went wrong. Check your API key in .env.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {stageId && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-lg bg-background border border-border rounded-2xl shadow-lg p-6 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="ds-title-sm">{STUCK.dialogTitle}</h2>
                {stageMeta && (
                  <p className="ds-small text-muted-foreground mt-0.5">
                    Stage: {stageMeta.label}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!response ? (
              <>
                <p className="ds-small text-muted-foreground mb-4">{STUCK.dialogSubtitle}</p>
                <textarea
                  value={blocker}
                  onChange={(e) => setBlocker(e.target.value)}
                  placeholder={STUCK.inputPlaceholder}
                  rows={3}
                  className="w-full border border-border rounded-xl px-4 py-3 ds-body bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none mb-4"
                />

                {error && <p className="ds-small text-destructive mb-3">{error}</p>}

                <button
                  onClick={handleSubmit}
                  disabled={!blocker.trim() || loading}
                  className="w-full bg-foreground text-primary-foreground rounded-full py-3 ds-label font-medium hover:opacity-80 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {STUCK.loadingMessage}
                    </>
                  ) : (
                    STUCK.submitButton
                  )}
                </button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* AI response */}
                <div className="border border-ai rounded-xl p-4 mb-4 overflow-y-auto max-h-[50vh]">
                  <p className="ds-caption text-ai mb-2 font-medium">AI diagnosis</p>
                  <div className="ds-body prose prose-sm max-w-none">
                    <ReactMarkdown>{response}</ReactMarkdown>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setResponse(null); setBlocker('') }}
                    className="flex-1 border border-border rounded-full py-2.5 ds-small hover:border-foreground transition-all"
                  >
                    Ask something else
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-foreground text-primary-foreground rounded-full py-2.5 ds-small hover:opacity-80 transition-opacity"
                  >
                    Got it, thanks
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
