@echo off
cd /d "%~dp0"

echo Verificando dependencias...
if not exist "node_modules" (
  echo Instalando dependencias...
  npm install
)

if not exist ".env" (
  echo.
  echo [ERROR] No se encontro el archivo .env
  echo Copia .env.example a .env y agrega tu MINIMAX_API_KEY
  echo.
  pause
  exit /b 1
)

echo.
echo Levantando servidor MCP en http://localhost:3001
echo.
node server.mjs
