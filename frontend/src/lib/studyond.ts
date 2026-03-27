import { SYSTEM_PROMPT_BASE } from './prompts'

export async function askStudyond(question: string): Promise<string> {
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
      max_tokens: 300,
      system: SYSTEM_PROMPT_BASE,
      messages: [{ role: 'user', content: question }],
    }),
  })

  if (!res.ok) {
    throw new Error(`Anthropic request failed: ${res.status}`)
  }

  const data = await res.json()
  const text = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? ''
  return text.trim()
}