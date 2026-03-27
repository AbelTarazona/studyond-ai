import express from 'express'
import cors from 'cors'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONTEXT_PATH = path.resolve(__dirname, 'context')  // ruta absoluta siempre
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://andalusiathesisgps.vercel.app',
]

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

app.post('/api/mcp', async (req, res) => {
  try {
    const { tool, args } = req.body

    // Normaliza el path: si viene relativo, lo convierte a absoluto dentro de context/
    const normalizedArgs = { ...args }
    if (normalizedArgs.path) {
      const p = normalizedArgs.path
      // Si ya es absoluto y apunta a context, déjalo; si no, resuelve desde context
      if (!path.isAbsolute(p)) {
        normalizedArgs.path = path.join(CONTEXT_PATH, p)
      }
    }

    const result = await mcp.callTool({ name: tool, arguments: normalizedArgs })
    res.json(result)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/tools', async (req, res) => {
  const tools = await mcp.listTools()
  res.json(tools)
})

app.listen(3001, () => console.log('Proxy MCP en http://localhost:3001'))