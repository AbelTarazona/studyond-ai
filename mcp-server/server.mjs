import express from 'express'
import cors from 'cors'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { ALLOWED_ORIGINS, CONTEXT_PATH, MINIMAX_BASE_URL, MINIMAX_MODEL } from './src/config.mjs'
import { getMaskedApiKey } from './src/text-utils.mjs'
import { registerChatRoutes } from './src/routes/chat.mjs'
import { registerMcpRoutes } from './src/routes/mcp.mjs'
import { buildEmbeddingsIndex } from './src/rag.mjs'

const app = express()
app.use(cors({ origin: ALLOWED_ORIGINS }))
app.use(express.json())

const transport = new StdioClientTransport({
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-filesystem', CONTEXT_PATH],
})

const mcp = new Client({ name: 'studyond-proxy', version: '1.0.0' })
await mcp.connect(transport)
console.log('MCP conectado →', CONTEXT_PATH)

await buildEmbeddingsIndex()

registerMcpRoutes(app, mcp)
registerChatRoutes(app)

app.listen(3001, () => {
  console.log('Proxy MCP en http://localhost:3001')
  console.log('Chat provider:', {
    baseURL: MINIMAX_BASE_URL,
    model: MINIMAX_MODEL,
    hasApiKey: Boolean(process.env.MINIMAX_API_KEY),
    maskedApiKey: getMaskedApiKey(process.env.MINIMAX_API_KEY),
  })
})
