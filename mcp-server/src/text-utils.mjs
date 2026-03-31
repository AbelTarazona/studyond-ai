import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages'

export function getMaskedApiKey(rawKey) {
  if (!rawKey || typeof rawKey !== 'string') {
    return null
  }

  const trimmed = rawKey.trim()
  if (trimmed.length <= 8) {
    return '***'
  }

  return `${trimmed.slice(0, 4)}...${trimmed.slice(-4)}`
}

export function toLangChainMessages(messages) {
  return messages
    .filter((message) => typeof message?.content === 'string' && message.content.trim().length > 0)
    .map((message) => {
      if (message.role === 'system') {
        return new SystemMessage(message.content)
      }

      if (message.role === 'assistant') {
        return new AIMessage(message.content)
      }

      return new HumanMessage(message.content)
    })
}

export function toProviderMessages(messages) {
  return messages
    .filter((message) => typeof message?.content === 'string' && message.content.trim().length > 0)
    .map((message) => {
      if (message.role === 'assistant') {
        return { role: 'assistant', content: message.content }
      }

      if (message.role === 'system') {
        return { role: 'user', content: `[SYSTEM]\n${message.content}` }
      }

      return { role: 'user', content: message.content }
    })
}

export function getMessageText(responseMessage) {
  if (typeof responseMessage?.content === 'string') {
    return responseMessage.content
  }

  if (Array.isArray(responseMessage?.content)) {
    return responseMessage.content
      .map((item) => {
        if (typeof item === 'string') return item
        if (typeof item?.text === 'string') return item.text
        return ''
      })
      .join('')
      .trim()
  }

  return ''
}
