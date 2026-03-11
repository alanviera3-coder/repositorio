@echo off
title DemandaPRO

cd /d %~dp0

echo.
echo  =========================================
echo     DemandaPRO - Iniciando o app...
echo  =========================================
echo.

if not exist "backend\node_modules" (
  echo  Instalando dependencias do backend...
  call npm install --prefix backend
  if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  ERRO ao instalar dependencias.
    echo  Verifique se o Node.js esta instalado: https://nodejs.org
    pause
    exit /b 1
  )
)

if not exist "frontend\node_modules" (
  echo  Instalando dependencias do frontend...
  call npm install --prefix frontend
)

if not exist "frontend\dist" (
  echo  Preparando o app pela primeira vez (aguarde 1-2 min)...
  call npm run build --prefix frontend
)

node backend\seed.js 2>nul

echo.
echo  Iniciando...
echo.
node backend\server.js

pause
