import { ChatOpenAI } from '@langchain/openai'
import { MINIMAX_BASE_URL, MINIMAX_MODEL, MINIMAX_TEMPERATURE } from './config.mjs'
import { toProviderMessages } from './text-utils.mjs'

let chatModel = null
let chatModelWithoutTemperature = null

export function getChatModel() {
  if (!process.env.MINIMAX_API_KEY) {
    throw new Error('Falta MINIMAX_API_KEY en el entorno del servidor MCP.')
  }

  if (!chatModel) {
    chatModel = new ChatOpenAI({
      apiKey: process.env.MINIMAX_API_KEY,
      model: MINIMAX_MODEL,
      temperature: MINIMAX_TEMPERATURE,
      configuration: { baseURL: MINIMAX_BASE_URL },
    })
  }

  return chatModel
}

export function getChatModelWithoutTemperature() {
  if (!process.env.MINIMAX_API_KEY) {
    throw new Error('Falta MINIMAX_API_KEY en el entorno del servidor MCP.')
  }

  if (!chatModelWithoutTemperature) {
    chatModelWithoutTemperature = new ChatOpenAI({
      apiKey: process.env.MINIMAX_API_KEY,
      model: MINIMAX_MODEL,
      configuration: { baseURL: MINIMAX_BASE_URL },
    })
  }

  return chatModelWithoutTemperature
}

export async function invokeMiniMaxDirect(messages) {
  if (!process.env.MINIMAX_API_KEY) {
    throw new Error('Falta MINIMAX_API_KEY en el entorno del servidor MCP.')
  }

  const payload = {
    model: MINIMAX_MODEL,
    messages: toProviderMessages(messages),
  }

  if (Number.isFinite(MINIMAX_TEMPERATURE)) {
    payload.temperature = MINIMAX_TEMPERATURE
  }

  const response = await fetch(`${MINIMAX_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MINIMAX_API_KEY}`,
    },
    body: JSON.stringify(payload),
  })

  const rawBody = await response.text()
  if (!response.ok) {
    throw new Error(`MiniMax direct chat error ${response.status}: ${rawBody}`)
  }

  let parsed
  try {
    parsed = JSON.parse(rawBody)
  } catch {
    throw new Error('Respuesta invalida de MiniMax en fallback directo.')
  }

  const content = parsed?.choices?.[0]?.message?.content
  if (typeof content === 'string' && content.trim().length > 0) {
    return content
  }

  throw new Error('MiniMax no devolvio contenido en el fallback directo.')
}
