import { promises as fs } from 'fs'
import { createHash } from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'
import { SystemMessage } from '@langchain/core/messages'
import { CONTEXT_PATH, OPENAI_EMBEDDING_MODEL, RAG_TOP_K } from './config.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CACHE_PATH = path.resolve(__dirname, '../embeddings.cache.json')
const CACHE_VERSION = 1
const CHUNK_MAX_CHARS = 2000
const CHUNK_MIN_CHARS = 50
const EMBED_BATCH_SIZE = 20
const MIN_RELEVANCE_SCORE = 0.50

let embeddingsIndex = null

// ---------------------------------------------------------------------------
// Embeddings via OpenAI API
// ---------------------------------------------------------------------------

async function embedTexts(texts) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Falta OPENAI_API_KEY en el entorno del servidor MCP.')
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: OPENAI_EMBEDDING_MODEL, input: texts }),
  })

  const rawBody = await response.text()
  if (!response.ok) {
    throw new Error(`OpenAI embeddings error ${response.status}: ${rawBody}`)
  }

  let parsed
  try {
    parsed = JSON.parse(rawBody)
  } catch {
    throw new Error('Respuesta inválida de OpenAI embeddings.')
  }

  return parsed.data.map((item) => item.embedding)
}

// ---------------------------------------------------------------------------
// Markdown chunking
// ---------------------------------------------------------------------------

function chunkMarkdown(content, relativePath) {
  const chunks = []

  // Split by H2 headings
  const sections = content.split(/\n(?=## )/)

  for (const section of sections) {
    const trimmed = section.trim()
    if (trimmed.length < CHUNK_MIN_CHARS) continue

    const headingMatch = trimmed.match(/^## (.+)/)
    const heading = headingMatch ? headingMatch[1].trim() : null

    if (trimmed.length <= CHUNK_MAX_CHARS) {
      chunks.push({ relativePath, heading, content: trimmed })
      continue
    }

    // Sub-chunk large sections by double newlines (paragraphs)
    const paragraphs = trimmed.split(/\n\n+/)
    let current = ''

    for (const para of paragraphs) {
      if (current.length > 0 && (current + para).length > CHUNK_MAX_CHARS) {
        if (current.length >= CHUNK_MIN_CHARS) {
          chunks.push({ relativePath, heading, content: current.trim() })
        }
        current = para
      } else {
        current += (current ? '\n\n' : '') + para
      }
    }

    if (current.trim().length >= CHUNK_MIN_CHARS) {
      chunks.push({ relativePath, heading, content: current.trim() })
    }
  }

  // Fallback: use the whole file if no sections were found
  if (chunks.length === 0 && content.trim().length >= CHUNK_MIN_CHARS) {
    chunks.push({ relativePath, heading: null, content: content.trim().slice(0, CHUNK_MAX_CHARS) })
  }

  return chunks
}

// ---------------------------------------------------------------------------
// Math helpers
// ---------------------------------------------------------------------------

function cosineSimilarity(a, b) {
  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

function hashContent(content) {
  return createHash('md5').update(content).digest('hex')
}

// ---------------------------------------------------------------------------
// File cache
// ---------------------------------------------------------------------------

async function loadCache() {
  try {
    const raw = await fs.readFile(CACHE_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    if (parsed.version === CACHE_VERSION && Array.isArray(parsed.chunks)) {
      return parsed.chunks
    }
  } catch {
    // Cache missing or corrupt — will rebuild from scratch
  }
  return []
}

async function saveCache(chunks) {
  await fs.writeFile(CACHE_PATH, JSON.stringify({ version: CACHE_VERSION, chunks }))
}

// ---------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------

async function getMarkdownFilesRecursively(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      files.push(...await getMarkdownFilesRecursively(fullPath))
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files
}

// ---------------------------------------------------------------------------
// Public: build (or restore) the embeddings index
// ---------------------------------------------------------------------------

export async function buildEmbeddingsIndex() {
  if (embeddingsIndex) return embeddingsIndex

  const markdownFiles = await getMarkdownFilesRecursively(CONTEXT_PATH)

  // Load existing cache and build a lookup map by chunk id
  const cachedChunks = await loadCache()
  const cacheMap = new Map(cachedChunks.map((c) => [c.id, c]))

  const allChunks = []
  const toEmbed = []

  for (const filePath of markdownFiles) {
    const content = await fs.readFile(filePath, 'utf8')
    const relativePath = path.relative(CONTEXT_PATH, filePath).replaceAll('\\', '/')
    const fileChunks = chunkMarkdown(content, relativePath)

    for (let i = 0; i < fileChunks.length; i++) {
      const chunk = fileChunks[i]
      const id = `${relativePath}#${i}`
      const contentHash = hashContent(chunk.content)
      const cached = cacheMap.get(id)

      if (cached && cached.contentHash === contentHash && Array.isArray(cached.embedding)) {
        allChunks.push({ id, ...chunk, contentHash, embedding: cached.embedding })
      } else {
        const entry = { id, ...chunk, contentHash, embedding: null }
        allChunks.push(entry)
        toEmbed.push(entry)
      }
    }
  }

  // Embed new/changed chunks in batches
  if (toEmbed.length > 0) {
    console.log(`Generando embeddings para ${toEmbed.length} chunks nuevos o modificados...`)

    for (let i = 0; i < toEmbed.length; i += EMBED_BATCH_SIZE) {
      const batch = toEmbed.slice(i, i + EMBED_BATCH_SIZE)
      const vectors = await embedTexts(batch.map((e) => e.content))

      for (let j = 0; j < batch.length; j++) {
        batch[j].embedding = vectors[j]
      }

      console.log(`Embeddings: ${Math.min(i + EMBED_BATCH_SIZE, toEmbed.length)}/${toEmbed.length}`)
    }

    await saveCache(allChunks)
  }

  embeddingsIndex = allChunks
  console.log(`Embeddings index listo: ${allChunks.length} chunks de ${markdownFiles.length} archivos`)
  return embeddingsIndex
}

// ---------------------------------------------------------------------------
// Public: build the context SystemMessage for a conversation
// ---------------------------------------------------------------------------

export async function buildContextSystemMessage(messages) {
  const lastUserMessage = [...messages].reverse().find((m) => m?.role === 'user')
  if (!lastUserMessage?.content || typeof lastUserMessage.content !== 'string') return null

  const query = lastUserMessage.content.trim()
  if (!query) return null

  const index = await buildEmbeddingsIndex()

  const [queryEmbedding] = await embedTexts([query])

  const scored = index.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }))

  scored.sort((a, b) => b.score - a.score)

  const topChunks = scored.slice(0, RAG_TOP_K).filter((r) => r.score >= MIN_RELEVANCE_SCORE)

  if (topChunks.length === 0) return null

  const sources = topChunks.map(({ chunk, score }) => ({
    relativePath: chunk.relativePath,
    heading: chunk.heading ?? null,
    score,
  }))

  const snippets = topChunks.map(({ chunk, score }) => {
    const source = chunk.heading
      ? `${chunk.relativePath} › ${chunk.heading}`
      : chunk.relativePath
    return `Fuente: ${source} (relevancia: ${score.toFixed(2)})\n${chunk.content}`
  })

  const contextBlock = snippets.join('\n\n---\n\n').slice(0, 8000)
  const systemMessage = new SystemMessage(
    `Contexto recuperado desde Studyond Brain.\n\nINSTRUCCIÓN IMPORTANTE: Solo puedes responder usando la información de este contexto. Si la pregunta no está cubierta por el contexto proporcionado, responde exactamente: "Lo siento, solo puedo responder preguntas relacionadas con el contenido definido en Studyond."\n\n${contextBlock}`,
  )

  return { systemMessage, sources }
}
