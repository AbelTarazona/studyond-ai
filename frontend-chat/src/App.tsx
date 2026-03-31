import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

type ChatRole = 'system' | 'user' | 'assistant'

type Source = { relativePath: string; heading: string | null; score: number }

type ChatMessage = {
  id: number
  role: ChatRole
  text: string
  sources?: Source[]
}

const API_BASE = (import.meta.env.VITE_MCP_BROWSER_BASE ?? '').trim()

function parseChatResponse(data: unknown): { text: string; sources: Source[] } {
  if (!data || typeof data !== 'object') {
    return { text: 'Sin respuesta del servidor.', sources: [] }
  }

  const parsed = data as {
    reply?: string
    error?: string
    sources?: Source[]
  }

  const sources = Array.isArray(parsed.sources) ? parsed.sources : []

  if (parsed.error) {
    return { text: `Error: ${parsed.error}`, sources }
  }

  if (typeof parsed.reply === 'string' && parsed.reply.trim().length > 0) {
    return { text: parsed.reply, sources }
  }

  return { text: JSON.stringify(data, null, 2), sources }
}

const SYSTEM_PROMPT =
  'Eres un asistente de Studyond. Solo puedes responder usando el contexto que se te proporciona en el sistema. Si la pregunta no está cubierta por ese contexto, responde únicamente: "Lo siento, solo puedo responder preguntas relacionadas con el contenido definido en Studyond."'

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'system',
      text: 'Hola, soy tu bot conversacional. Puedo ayudarte con dudas de tesis, investigacion y redaccion academica.',
    },
  ])
  const [prompt, setPrompt] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const requestChat = async (conversation: Array<{ role: ChatRole; content: string }>) => {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversation }),
    })

    if (!response.ok) {
      const body = await response.text()
      throw new Error(`HTTP ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`)
    }

    const data = (await response.json()) as unknown
    return parseChatResponse(data)
  }

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = prompt.trim()
    if (!value || sending) {
      return
    }

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      role: 'user',
      text: value,
    }

    setMessages((prev) => [...prev, userMessage])
    setPrompt('')

    setSending(true)
    try {
      const history = [...messages, userMessage]
        .filter((message) => message.role !== 'system')
        .map((message) => ({
          role: message.role,
          content: message.text,
        }))

      const { text, sources } = await requestChat([
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
      ])

      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, role: 'assistant', text, sources },
      ])
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No fue posible conectar con MCP.'
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, role: 'assistant', text: `Error: ${message}` },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-100 to-neutral-200 p-4 md:p-8 dark:from-neutral-950 dark:to-neutral-900">
      <Card className="mx-auto flex h-[calc(100vh-2rem)] w-full max-w-5xl flex-col border-neutral-300/80 bg-white/80 shadow-xl backdrop-blur md:h-[calc(100vh-4rem)] dark:border-neutral-700 dark:bg-neutral-900/70">
        <CardHeader>
          <CardTitle className="text-2xl">frontend-chat (LangChain + MiniMax)</CardTitle>
          <CardDescription>
            Bot conversacional de una sola pantalla conectado a LangChain en el backend.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
          <ScrollArea className="min-h-0 flex-1 rounded-xl border bg-background/70 p-4">
            <div className="space-y-3">
              {messages.map((message) => {
                const isUser = message.role === 'user'
                const bubbleClass = isUser
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : message.role === 'system'
                    ? 'mx-auto bg-muted text-muted-foreground'
                    : 'mr-auto bg-card text-card-foreground border'

                const hasSources =
                  message.role === 'assistant' &&
                  Array.isArray(message.sources) &&
                  message.sources.length > 0

                return (
                  <div key={message.id} className={`max-w-[85%] ${isUser ? 'ml-auto' : message.role === 'system' ? 'mx-auto' : 'mr-auto'}`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm ${bubbleClass}`}>
                      {message.role === 'assistant'
                        ? (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                              ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>,
                              li: ({ children }) => <li>{children}</li>,
                              code: ({ children }) => <code className="rounded bg-black/10 px-1 font-mono text-xs">{children}</code>,
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        )
                        : message.text}
                    </div>
                    {hasSources && (
                      <div className="mt-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                          📄 Fuentes
                        </p>
                        <ul className="space-y-0.5">
                          {message.sources!.map((s, i) => (
                            <li key={i} className="text-xs text-neutral-600 dark:text-neutral-300">
                              {s.heading
                                ? <><span className="font-medium">{s.relativePath}</span><span className="text-neutral-400"> › </span>{s.heading}</>
                                : <span className="font-medium">{s.relativePath}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <form className="flex gap-2" onSubmit={handleSend}>
            <Input
              placeholder="Escribe tu mensaje..."
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              disabled={sending}
            />
            <Button type="submit" disabled={sending}>
              {sending ? 'Enviando...' : 'Enviar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

export default App
