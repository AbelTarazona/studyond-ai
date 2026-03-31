# Studyond AI Monorepo

Plataforma de IA para guiar a estudiantes a través del journey de tesis. Construida para StartHack 2026.

El monorepo tiene dos paquetes principales: un chat web con IA y un servidor backend con RAG + MCP.

## Estructura del monorepo

```text
studyond-ai/
  frontend-chat/             # App de chat React + Vite + TypeScript
  mcp-server/                # Servidor Express: RAG, LLM, proxy MCP, base de conocimiento
    context/                 # "Studyond Brain" — 70+ notas atómicas en Markdown
    brand/                   # Guías visuales, colores, tipografía, componentes
    mock-data/               # Datos de ejemplo para experimentación
    src/                     # Lógica del servidor (RAG, LLM, rutas, config)
  start.bat                  # Script de arranque rápido (levanta ambos servidores)
```

## Qué vive en cada paquete

### frontend-chat

Aplicación web de chat para estudiantes. Se comunica con el backend para obtener respuestas
fundamentadas en el Studyond Brain.

Tecnologías:

- React 19 + Vite + TypeScript
- TailwindCSS + shadcn/ui
- Framer Motion

Scripts (desde `frontend-chat/`):

- `npm run dev`: entorno local en `http://localhost:5173`
- `npm run build`: build de producción
- `npm run preview`: previsualizar build

### mcp-server

Servidor Express con tres responsabilidades:

1. **Chat con RAG** — recibe mensajes, recupera chunks relevantes del Studyond Brain con embeddings
   y similitud coseno, y genera la respuesta con MiniMax LLM.
2. **Proxy MCP** — expone herramientas de filesystem MCP para leer `context/` directamente.
3. **CORS** — configurado para frontend local y producción en Vercel.

Endpoints principales:

- `POST /api/chat` — chat con RAG (usado por el frontend)
- `GET /api/chat/health` — estado del proveedor LLM
- `POST /api/mcp` — ejecutar una tool MCP
- `GET /api/tools` — listar tools MCP disponibles

Tecnologías:

- Node.js (ESM) + Express 5
- LangChain + MiniMax (`MiniMax-Text-01`)
- OpenAI Embeddings (`text-embedding-3-small`)
- `@modelcontextprotocol/sdk`

Script:

- `npm run serve`: inicia el servidor en `http://localhost:3001`

## Cómo ejecutar en local

### Opción rápida — `start.bat`

Doble clic en `start.bat` en la raíz del repo. Levanta ambos servidores en terminales separadas.

### Manual

1. Instalar y levantar el servidor:

```bash
cd mcp-server
npm install
npm run serve
```

2. En otra terminal, instalar y levantar el frontend:

```bash
cd frontend-chat
npm install
npm run dev
```

3. Abrir `http://localhost:5173`.

## Variables de entorno

Crea `mcp-server/.env` con:

```env
MINIMAX_API_KEY=tu_clave_minimax
MINIMAX_BASE_URL=https://api.minimaxi.chat/v1
MINIMAX_MODEL=MiniMax-Text-01
MINIMAX_TEMPERATURE=0.7

OPENAI_API_KEY=tu_clave_openai   # para embeddings

RAG_TOP_K=5                      # chunks recuperados por consulta
```

## Flujo de trabajo recomendado

1. Cambios de UI → trabaja en `frontend-chat/`.
2. Cambios de contexto o lógica de IA → trabaja en `mcp-server/`.
3. Para agregar conocimiento al dominio, añade notas en `mcp-server/context/` (Markdown atómico, wiki-links con `[[Nota]]`).
4. Antes de abrir PR: `npm run build` en el frontend y verifica que `npm run serve` levante sin errores.

## Documentación interna

- `mcp-server/README.md`: brief del challenge y descripción del Studyond Brain.
- `mcp-server/brand/README.md`: guía de marca y diseño.
- `README-MCP-IA.md`: arquitectura RAG + MCP + LLM con diagrama de flujo.
