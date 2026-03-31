import path from 'path'
import { CONTEXT_PATH } from '../config.mjs'

export function registerMcpRoutes(app, mcpClient) {
  app.post('/api/mcp', async (req, res) => {
    try {
      const { tool, args } = req.body

      const normalizedArgs = { ...args }
      if (normalizedArgs.path) {
        const p = normalizedArgs.path
        if (!path.isAbsolute(p)) {
          normalizedArgs.path = path.join(CONTEXT_PATH, p)
        }
      }

      const result = await mcpClient.callTool({ name: tool, arguments: normalizedArgs })
      res.json(result)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  app.get('/api/tools', async (req, res) => {
    const tools = await mcpClient.listTools()
    res.json(tools)
  })
}
