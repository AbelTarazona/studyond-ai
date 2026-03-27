import { ChatAnthropic } from '@langchain/anthropic'
import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { listNotesTool, readNoteTool, searchNotesTool } from './mcpTools'

const tools = [listNotesTool, readNoteTool, searchNotesTool]

const llm = new ChatAnthropic({
  model: 'claude-sonnet-4-20250514',
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  temperature: 0,
})

export const agentExecutor = createReactAgent({ llm, tools })