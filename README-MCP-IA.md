# MCP + IA: Como Funciona En Este Monorepo

Arquitectura activa hoy: el frontend envía mensajes al backend, el backend recupera contexto del
Studyond Brain con RAG y genera la respuesta con MiniMax. El proxy MCP está disponible como capa
adicional de acceso al filesystem de contexto.

## Diagrama de Flujo

```
┌─────────────────────────────────────────────────────┐
│                    USUARIO                          │
└─────────────────────┬───────────────────────────────┘
                      │ escribe mensaje
                      ▼
┌─────────────────────────────────────────────────────┐
│           frontend-chat  (React :5173)              │
│                                                     │
│   App.tsx  →  POST /api/chat  { messages }          │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP
                      ▼
┌─────────────────────────────────────────────────────┐
│           mcp-server  (Express :3001)               │
│                                                     │
│  routes/chat.mjs                                    │
│    │                                                │
│    ├── src/rag.mjs                                  │
│    │     ├── OpenAI Embeddings (text-embedding-3)   │
│    │     │     └── vectoriza la consulta            │
│    │     ├── índice en memoria (embeddings.cache)   │
│    │     │     └── ~3190 chunks de 70+ notas .md    │
│    │     ├── similitud coseno → top-K chunks        │
│    │     └── resuelve WikiLinks [[Nota]] enlazadas  │
│    │                                                │
│    └── src/llm.mjs  (MiniMax LLM)                  │
│          └── genera respuesta con contexto RAG      │
│                                                     │
│  Respuesta: { reply, sources, model }               │
└─────────────────────┬───────────────────────────────┘
                      │ JSON
                      ▼
┌─────────────────────────────────────────────────────┐
│           frontend-chat                             │
│                                                     │
│   muestra respuesta + lista de fuentes citadas      │
└─────────────────────────────────────────────────────┘

             ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
                  Proxy MCP (disponible)
             │  POST /api/mcp              │
                GET  /api/tools
             │  → filesystem MCP           │
                  → context/
             └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

## Componentes Clave

### 1) Rutas de chat — `mcp-server/src/routes/chat.mjs`

Punto de entrada del backend para la conversación.

- Recibe `{ messages }` del frontend.
- Llama a `buildContextSystemMessage()` para obtener los chunks RAG relevantes.
- Invoca el LLM MiniMax con el contexto inyectado.
- Devuelve `{ reply, sources, model }`.

Endpoints:

- `POST /api/chat` — conversación con RAG
- `GET /api/chat/health` — estado del proveedor LLM

### 2) Pipeline RAG — `mcp-server/src/rag.mjs`

Recuperación de contexto desde el Studyond Brain.

Proceso al recibir una consulta:

1. Lee todos los `.md` de `context/` y los divide en chunks (máx. 2000 chars, por secciones H2).
2. Genera embeddings con OpenAI `text-embedding-3-small` y los guarda en `embeddings.cache.json`.
3. En cada consulta: vectoriza la pregunta del usuario y calcula similitud coseno contra el índice.
4. Selecciona los top-K chunks con score ≥ 0.50.
5. Resuelve WikiLinks (`[[Nombre]]`) en los chunks seleccionados e incluye hasta 2 chunks por nota vinculada.
6. Construye un `SystemMessage` con todos los snippets y lista de fuentes.

Parámetros configurables (via `.env`):

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `RAG_TOP_K` | `5` | Chunks recuperados por consulta |
| `OPENAI_EMBEDDING_MODEL` | `text-embedding-3-small` | Modelo de embeddings |

### 3) LLM — `mcp-server/src/llm.mjs`

Wrapper sobre MiniMax usando la interfaz compatible con OpenAI.

- Modelo: `MiniMax-Text-01` (configurable con `MINIMAX_MODEL`)
- Temperatura: `0.7` (configurable con `MINIMAX_TEMPERATURE`)
- Fallback automático si el modelo rechaza el parámetro `temperature`.

### 4) Proxy MCP — `mcp-server/server.mjs`

Capa disponible para acceso directo al filesystem de contexto via MCP.

- Levanta un cliente MCP contra `@modelcontextprotocol/server-filesystem`.
- Limita el alcance al directorio `mcp-server/context/`.
- Normaliza paths relativos para evitar lecturas fuera del dominio.

Endpoints:

- `POST /api/mcp` — ejecuta una tool MCP con argumentos
- `GET /api/tools` — lista tools disponibles (`list_notes`, `read_note`, `search_notes`)

### 5) Frontend — `frontend-chat/src/App.tsx`

UI de chat minimalista.

- Envía el historial de mensajes a `POST /api/chat`.
- Renderiza la respuesta en Markdown.
- Muestra las fuentes citadas (archivos del Studyond Brain usados en la respuesta).

## Cómo Levantarlo En Local

1. Configurar variables de entorno:

```env
# mcp-server/.env
MINIMAX_API_KEY=tu_clave
MINIMAX_BASE_URL=https://api.minimaxi.chat/v1
OPENAI_API_KEY=tu_clave_openai
```

2. Iniciar el servidor:

```bash
cd mcp-server
npm install
npm run serve
```

3. Iniciar el frontend:

```bash
cd frontend-chat
npm install
npm run dev
```

4. Verificar que el backend responde:

```bash
curl http://localhost:3001/api/chat/health
```

## Seguridad y Límites Actuales

- CORS restringido a orígenes conocidos (`config.mjs`): `localhost:5173`, `localhost:5174`, producción en Vercel.
- Paths de filesystem normalizados a `context/` para evitar lecturas fuera del dominio.
- El cache de embeddings se regenera solo si el contenido de las notas cambia (hash MD5 por chunk).
- Para producción: agregar autenticación y rate limiting en `/api/chat` y `/api/mcp`.

## Próximos Pasos Recomendados

1. Conectar el proxy MCP directamente al flujo de chat como tool del agente LangChain.
2. Exponer logs de las fuentes usadas en la UI para mayor trazabilidad.
3. Agregar autenticación (JWT o API key) antes de desplegar en producción.
4. Explorar reranking de chunks para mejorar la relevancia en consultas largas.
