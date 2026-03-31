@echo off
cd /d "%~dp0"

echo ================================
echo  Studyond AI - Dev Environment
echo ================================
echo.

:: --- MCP Server ---
if not exist "mcp-server\.env" (
  echo [ERROR] mcp-server\.env no encontrado.
  echo Copia mcp-server\.env.example a mcp-server\.env y agrega tu MINIMAX_API_KEY
  echo.
  pause
  exit /b 1
)

if not exist "mcp-server\node_modules" (
  echo Instalando dependencias del servidor...
  cd mcp-server && npm install && cd ..
)

:: --- Frontend ---
if not exist "frontend-chat\node_modules" (
  echo Instalando dependencias del frontend...
  cd frontend-chat && npm install && cd ..
)

echo.
echo Iniciando servidor MCP    ^(http://localhost:3001^)
echo Iniciando frontend-chat   ^(http://localhost:5174^)
echo.
echo Presiona Ctrl+C en cada ventana para detener.
echo.

start "MCP Server" cmd /k "cd /d "%~dp0mcp-server" && node server.mjs"
timeout /t 2 /nobreak >nul
start "Frontend Chat" cmd /k "cd /d "%~dp0frontend-chat" && npm run dev"
