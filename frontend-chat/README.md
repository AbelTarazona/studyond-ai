# frontend-chat

Chat de una sola pantalla construido con React + Vite + shadcn/ui para hablar con un bot conversacional.
El bot se sirve desde `mcp-server` usando LangChain + API de MiniMax.

## Requisitos

- `mcp-server` corriendo en `http://localhost:3001` (carpeta `mcp-server`)
- Node.js 20+

## Ejecutar

1. Instala dependencias:

```bash
npm install
```

2. Configura entorno:

```bash
cp .env.example .env
```

3. Levanta en desarrollo:

```bash
npm run dev
```

El frontend usa por defecto el puerto `5174`.

## Flujo conversacional

- El frontend manda el historial de chat a `POST /api/chat`.
- El backend `mcp-server` usa LangChain para llamar a MiniMax.

## Variables de entorno relevantes

- Frontend: `VITE_MCP_TARGET` (por defecto `http://localhost:3001`)
- Backend: `MINIMAX_API_KEY`, `MINIMAX_BASE_URL`, `MINIMAX_MODEL`, `MINIMAX_TEMPERATURE`
