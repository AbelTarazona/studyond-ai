import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'

const MCP_URL = import.meta.env.VITE_MCP_URL ?? 'http://localhost:3001'

async function callMcp(tool: string, args: Record<string, string>) {
  const res = await fetch(`${MCP_URL}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool, args }),
  })
  const data = await res.json()
  return data.content?.[0]?.text ?? ''
}

export const listNotesTool = new DynamicStructuredTool({
  name: 'list_notes',
  description: 'List all .md files available in the Studyond Brain knowledge base',
  schema: z.object({}),
  func: async () => callMcp('list_directory', { path: '.' }),
})

export const readNoteTool = new DynamicStructuredTool({
  name: 'read_note',
  description: 'Read the full content of a specific note from the Studyond Brain. Pass the exact filename including .md extension, for example: "Thesis Journey.md"',
  schema: z.object({
    filename: z.string().describe('Exact filename of the .md note to read, including extension'),
  }),
  func: async ({ filename }) => callMcp('read_file', { path: filename }),
})

export const searchNotesTool = new DynamicStructuredTool({
  name: 'search_notes',
  description: 'Search for a keyword or phrase across all notes in the Studyond Brain knowledge base. Returns file matches containing the search term.',
  schema: z.object({
    query: z.string().describe('Keyword or phrase to search across all notes'),
  }),
  func: async ({ query }) => callMcp('search_files', { path: '.', pattern: query }),
})