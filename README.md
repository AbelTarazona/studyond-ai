# Studyond AI Monorepo

Este repositorio concentra dos piezas principales del proyecto:

- `frontend/`: aplicación web (React + Vite + TypeScript) para la experiencia Thesis GPS.
- `mcp-server/`: servidor Node.js que expone herramientas MCP para consultar el conocimiento en `context/`.

La idea del monorepo es mantener producto, contexto y tooling en un mismo lugar para iterar rápido.

## Estructura del monorepo

```text
studyond-ai/
  frontend/                # SPA principal (UI, lógica de stages, recomendaciones, AI helpers)
  mcp-server/              # Proxy MCP + base de conocimiento y assets de marca
    context/               # "Studyond Brain" (notas atómicas enlazadas)
    brand/                 # guías visuales, componentes, color, tipografía
    mock-data/             # datos de ejemplo para experimentación
```

## Qué vive en cada paquete

### frontend

Aplicación cliente para estudiantes, con:

- mapa de journey de tesis,
- flujo por etapas,
- recomendaciones y matching,
- integración con AI.

Tecnologías principales:

- React 19
- Vite 5
- TypeScript
- Zustand
- Framer Motion

Scripts:

- `npm run dev`: entorno local
- `npm run build`: build de producción
- `npm run preview`: previsualizar build
- `npm run lint`: lint del código

### mcp-server

Servidor Express que actúa como puente hacia un servidor MCP de filesystem para leer `context/`.

Responsabilidades:

- iniciar cliente MCP,
- exponer endpoint `POST /api/mcp` para ejecutar tools,
- exponer endpoint `GET /api/tools` para listar herramientas disponibles,
- aplicar CORS para frontend local y despliegue.

Tecnologías principales:

- Node.js (ESM)
- Express
- `@modelcontextprotocol/sdk`

Script:

- `npm run serve`: inicia el proxy en `http://localhost:3001`

## Cómo ejecutar el monorepo en local

Este monorepo no usa workspaces de npm/pnpm; cada paquete se instala por separado.

1. Instalar dependencias del frontend:

```bash
cd frontend
npm install
```

2. Instalar dependencias del servidor MCP:

```bash
cd ../mcp-server
npm install
```

3. Ejecutar el servidor MCP:

```bash
npm run serve
```

4. En otra terminal, ejecutar el frontend:

```bash
cd ../frontend
npm run dev
```

5. Abrir la app en `http://localhost:5173`.

## Flujo de trabajo recomendado

1. Trabaja por paquete: cambios de UI en `frontend/`, cambios de contexto/integración MCP en `mcp-server/`.
2. Mantén las notas de `mcp-server/context/` pequeñas y atómicas para facilitar consumo por IA.
3. Antes de abrir PR:
   - ejecuta `npm run lint` y `npm run build` en `frontend/`;
   - verifica que `npm run serve` levante correctamente en `mcp-server/`.

## Documentación útil dentro del repo

- `frontend/README.md`: detalles funcionales del producto Thesis GPS.
- `mcp-server/README.md`: brief del challenge y uso del Studyond Brain.
- `mcp-server/brand/README.md`: guía de marca y diseño.
- `README-MCP-IA.md`: arquitectura y flujo de integración entre MCP e IA en este monorepo.

## Notas

- Si necesitas AI en frontend, configura las variables de entorno correspondientes (por ejemplo claves para proveedores de LLM).
- El conocimiento de negocio y dominio está en `mcp-server/context/`; el frontend lo puede consumir a través del proxy MCP.
