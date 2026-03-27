# MCP + IA: Como Funciona En Este Monorepo

Este documento explica como se conecta la IA con MCP en este proyecto, que partes estan activas hoy y que partes ya estan preparadas para escalar.

## Resumen Rapido

- La IA conversacional del producto usa Anthropic (Claude) desde el frontend.
- El servidor MCP vive en mcp-server y expone acceso controlado al conocimiento en context.
- El frontend ya tiene tools MCP definidas para un agente LangChain.
- Actualmente, ese agente no esta conectado a la UI, pero la infraestructura base esta lista.

## Componentes Clave

### 1) Proxy MCP (backend)

Archivo principal: mcp-server/server.mjs

Responsabilidad:

- Levanta un cliente MCP contra @modelcontextprotocol/server-filesystem.
- Limita el alcance al directorio mcp-server/context.
- Expone API HTTP para que el frontend pueda invocar tools MCP.

Endpoints:

- POST /api/mcp: ejecuta una tool MCP con argumentos.
- GET /api/tools: lista tools disponibles.

Detalle importante:

- Si el frontend envia un path relativo, el servidor lo normaliza dentro de context para evitar lecturas fuera del dominio previsto.

### 2) Tools MCP en frontend

Archivo principal: frontend/src/lib/mcpTools.ts

Responsabilidad:

- Encapsula llamadas a POST /api/mcp.
- Define tools tipadas para LangChain:
  - list_notes
  - read_note
  - search_notes

En la practica, estas tools son la capa de traduccion entre una decision del agente y el API MCP real.

### 3) Agente IA con tools MCP

Archivo principal: frontend/src/lib/agent.ts

Responsabilidad:

- Crea un agente ReAct con createReactAgent.
- Le adjunta Claude como LLM.
- Le registra las 3 tools MCP del punto anterior.

Estado actual:

- El agente existe y compila.
- No hay uso directo de agentExecutor desde componentes de UI por ahora.

### 4) Flujos IA activos hoy en UI

Archivos:

- frontend/src/components/stuck/StuckDialog.tsx
- frontend/src/components/journey/ActionCard.tsx
- frontend/src/lib/studyond.ts

Funcionamiento actual:

- La UI construye prompts con frontend/src/lib/prompts.ts.
- Se llama directamente a Anthropic API desde el navegador.
- La respuesta se renderiza en los componentes (por ejemplo, en el dialogo de bloqueo).

Esto significa que hoy conviven dos estrategias:

- IA directa (activa en UI).
- IA con herramientas MCP (lista, pero no conectada a UI).

## Flujo End-To-End (MCP + IA)

Flujo objetivo cuando se usa el agente con tools:

1. Usuario hace una pregunta en la UI.
2. El componente invoca agentExecutor.
3. El agente decide si necesita leer contexto.
4. Si necesita datos, ejecuta list_notes/read_note/search_notes.
5. La tool llama al proxy MCP en /api/mcp.
6. El proxy ejecuta la tool real en el filesystem MCP.
7. El resultado vuelve al agente.
8. El agente responde al usuario con contexto del Studyond Brain.

## Como Levantarlo En Local

1. Iniciar proxy MCP:

```bash
cd mcp-server
npm install
npm run serve
```

2. Iniciar frontend:

```bash
cd ../frontend
npm install
npm run dev
```

3. Configurar clave de Anthropic en frontend/.env:

```env
VITE_ANTHROPIC_API_KEY=tu_clave
```

4. Verificar proxy:

```bash
curl http://localhost:3001/api/tools
```

## Diferencia Entre Los Dos Modos De IA

Modo A (activo): IA directa

- Menos complejidad.
- Respuesta rapida.
- No consulta automaticamente el grafo context.

Modo B (preparado): IA + MCP tools

- La IA puede explorar notas de contexto antes de responder.
- Mejora grounding y trazabilidad de respuestas.
- Requiere conectar agentExecutor en componentes de UI.

## Seguridad Y Limites Actuales

- CORS restringido a origenes conocidos en mcp-server/server.mjs.
- Paths normalizados a context para reducir riesgo de acceso accidental fuera de base.
- Si expones esto en produccion, agrega autenticacion y rate limiting en /api/mcp.

## Siguiente Paso Recomendado

Para usar MCP de verdad en la experiencia de usuario:

1. Crear un servicio en frontend que use agentExecutor.invoke().
2. Integrarlo primero en un punto controlado (por ejemplo, StuckDialog).
3. Agregar logs de tools usadas para depuracion.
4. Definir politicas de prompt para citar notas cuando se use contexto MCP.
