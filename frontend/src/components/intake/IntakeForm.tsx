import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { STAGES } from '@/lib/copy'
import type { IntakeData } from '@/store/journeyStore'

interface IntakeFormProps {
  onSubmit: (data: IntakeData) => void
}

type FormData = {
  degree: IntakeData['degree']
  topic: string
  university: string
  currentStage: string
  fieldIds: string[]
  deadline: string
}

type StepDefinition = {
  id: keyof FormData
  label: string
  type: 'select' | 'date' | 'text' | 'multiselect'
  options?: Array<{ value: string; label: string }>
  placeholder?: string
  helperText?: string
}

const STEPS: StepDefinition[] = [
  {
    id: 'currentStage' as const,
    label: 'Where are you in your journey?',
    type: 'select' as const,
    options: STAGES.map((s) => ({ value: s.id, label: s.label })),
  },
  {
    id: 'topic',
    label: 'What is your thesis direction right now?',
    type: 'text',
    placeholder: 'e.g. AI for sustainable supply chains, fintech regulation, or your study field',
  },
  {
    id: 'deadline' as const,
    label: 'When is your deadline?',
    type: 'date' as const,
    options: undefined,
  },
]

// Framer Motion variants
const msgVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

const optionContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const optionVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}

export function IntakeForm({ onSubmit }: IntakeFormProps) {
  const [step, setStep] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [form, setForm] = useState<FormData>({
    degree: 'msc',
    topic: '',
    university: 'University of St. Gallen (HSG)',
    currentStage: 'orientation',
    fieldIds: [],
    deadline: '',
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const totalSteps = STEPS.length
  const currentStep = STEPS[step]
  const progress = ((step + 1) / totalSteps) * 100

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [step])

  function advanceStep(formUpdate: Partial<FormData>) {
    const newForm = { ...form, ...formUpdate }
    setForm(newForm)
    setInputValue('')

    if (step + 1 >= totalSteps) {
      onSubmit(newForm as IntakeData)
    } else {
      setStep((s) => s + 1)
    }
  }

  function handleSelectOption(value: string) {
    advanceStep({ [currentStep.id]: value })
  }

  function handleDateSubmit() {
    if (!inputValue.trim()) return
    advanceStep({ [currentStep.id]: inputValue.trim() })
  }

  function handleTextSubmit() {
    if (!inputValue.trim()) return
    advanceStep({ [currentStep.id]: inputValue.trim() })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      if (currentStep.type === 'date') handleDateSubmit()
      if (currentStep.type === 'text') handleTextSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-12 text-center"
      >
        <h1 className="text-5xl font-bold mb-2 text-gray-900">Let's Map Your Thesis</h1>
        <p className="text-lg text-gray-600">Just three quick questions to adapt your route</p>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl mb-8">
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-blue-600"
          />
        </div>
        <div className="text-sm text-gray-600 mt-2">
          Step {step + 1} of {totalSteps}
        </div>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl p-8 shadow-sm"
      >
        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={msgVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {currentStep.label}
              </h2>

              {/* Select options */}
              {currentStep.type === 'select' && (
                <motion.div
                  className="space-y-3"
                  variants={optionContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {currentStep.options?.map((opt) => (
                    <motion.button
                      key={opt.value}
                      variants={optionVariants}
                      onClick={() => handleSelectOption(opt.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-left px-5 py-4 border border-gray-300 rounded-lg font-medium text-gray-900 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      {opt.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Date input */}
              {currentStep.type === 'date' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="space-y-4"
                >
                  <input
                    ref={inputRef}
                    type="date"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-5 py-4 border border-gray-300 rounded-lg font-medium text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-all"
                  />
                  <motion.button
                    onClick={handleDateSubmit}
                    disabled={!inputValue.trim()}
                    whileHover={inputValue.trim() ? { scale: 1.02 } : {}}
                    whileTap={inputValue.trim() ? { scale: 0.98 } : {}}
                    className="w-full px-5 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Continue
                  </motion.button>
                </motion.div>
              )}

              {/* Text input */}
              {currentStep.type === 'text' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="space-y-4"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={currentStep.placeholder}
                    className="w-full px-5 py-4 border border-gray-300 rounded-lg font-medium text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-all"
                  />
                  <motion.button
                    onClick={handleTextSubmit}
                    disabled={!inputValue.trim()}
                    whileHover={inputValue.trim() ? { scale: 1.02 } : {}}
                    whileTap={inputValue.trim() ? { scale: 0.98 } : {}}
                    className="w-full px-5 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Continue
                  </motion.button>
                </motion.div>
              )}

            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
