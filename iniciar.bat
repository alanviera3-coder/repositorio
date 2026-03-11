@echo off
title DemandaPRO

cd /d %~dp0

echo.
echo  =========================================
echo     DemandaPRO - Iniciando o app...
echo  =========================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo  ERRO: Node.js nao encontrado!
  echo.
  echo  Instale em: https://nodejs.org  (botao LTS)
  echo  Depois reinicie o computador e tente novamente.
  echo.
  pause
  exit /b 1
)

if not exist "backend\node_modules" (
  echo  Instalando dependencias do backend...
  npm install --prefix backend
)

if not exist "frontend\node_modules" (
  echo  Instalando dependencias do frontend...
  npm install --prefix frontend
)

if not exist "frontend\dist" (
  echo  Preparando o app pela primeira vez (aguarde 1-2 min)...
  npm run build --prefix frontend
)

node backend\seed.js 2>nul

echo.
echo  Iniciando...
echo.
node backend\server.js

pause
