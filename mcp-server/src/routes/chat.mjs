import { MINIMAX_BASE_URL, MINIMAX_MODEL } from '../config.mjs'
import { getChatModel, getChatModelWithoutTemperature, invokeMiniMaxDirect } from '../llm.mjs'
import { buildContextSystemMessage } from '../rag.mjs'
import { getMaskedApiKey, toLangChainMessages, getMessageText } from '../text-utils.mjs'

export function registerChatRoutes(app) {
  app.get('/api/chat/health', (req, res) => {
    const hasKey = typeof process.env.MINIMAX_API_KEY === 'string' && process.env.MINIMAX_API_KEY.trim().length > 0
    res.json({
      ok: true,
      provider: 'minimax-openai-compatible',
      baseURL: MINIMAX_BASE_URL,
      model: MINIMAX_MODEL,
      hasApiKey: hasKey,
      maskedApiKey: getMaskedApiKey(process.env.MINIMAX_API_KEY),
    })
  })

  app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body || {}
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Debes enviar un arreglo de mensajes.' })
      }

      const model = getChatModel()
      const conversation = toLangChainMessages(messages)
      if (conversation.length === 0) {
        return res.status(400).json({ error: 'No hay mensajes válidos para procesar.' })
      }

      const contextResult = await buildContextSystemMessage(messages)

      if (!contextResult) {
        return res.json({
          reply: 'Lo siento, solo puedo responder preguntas relacionadas con el contenido definido en Studyond.',
          sources: [],
        })
      }

      // Soporta tanto el formato nuevo { systemMessage, sources } como el formato antiguo (SystemMessage directo)
      const contextSystemMessage = contextResult.systemMessage ?? contextResult
      const sources = Array.isArray(contextResult.sources) ? contextResult.sources : []

      const conversationWithContext = [contextSystemMessage, ...conversation]

      let reply
      let directFallbackText = null

      try {
        reply = await model.invoke(conversationWithContext)
      } catch (invokeError) {
        const invokeMessage = typeof invokeError?.message === 'string' ? invokeError.message : ''
        const shouldRetryWithoutTemperature =
          invokeMessage.includes('invalid chat setting') || invokeMessage.includes('(2013)')

        if (!shouldRetryWithoutTemperature) {
          throw invokeError
        }

        const fallbackModel = getChatModelWithoutTemperature()

        try {
          reply = await fallbackModel.invoke(conversationWithContext)
        } catch {
          const requestMessages = [{ role: 'system', content: contextSystemMessage.content }, ...messages]
          directFallbackText = await invokeMiniMaxDirect(requestMessages)
        }
      }

      const text = directFallbackText || getMessageText(reply) || 'Sin respuesta del modelo.'

      res.json({ reply: text, model: MINIMAX_MODEL, sources })
    } catch (e) {
      const message = typeof e?.message === 'string' ? e.message : 'Error desconocido en /api/chat.'
      const hint = message.includes('invalid api key')
        ? 'Verifica MINIMAX_BASE_URL=https://api.minimaxi.chat/v1 y que MINIMAX_API_KEY pertenezca al mismo tenant/proyecto.'
        : null
      res.status(500).json({ error: message, hint })
    }
  })
}
