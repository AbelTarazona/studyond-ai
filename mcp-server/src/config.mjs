import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

dotenv.config({ override: true })

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const CONTEXT_PATH = path.resolve(__dirname, '../context')

export const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://andalusiathesisgps.vercel.app',
]

export const MINIMAX_BASE_URL = process.env.MINIMAX_BASE_URL || 'https://api.minimaxi.chat/v1'
export const MINIMAX_MODEL = process.env.MINIMAX_MODEL || 'MiniMax-Text-01'
export const MINIMAX_TEMPERATURE = Number(process.env.MINIMAX_TEMPERATURE || 0.7)
export const OPENAI_EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small'
export const RAG_TOP_K = Number(process.env.RAG_TOP_K || 5)
