@echo off
chcp 65001 > nul
title DemandaPRO

echo.
echo =========================================
echo    DemandaPRO — Iniciando o app...
echo =========================================
echo.

cd /d "%~dp0"

:: Verificar se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo  Node.js nao encontrado!
  echo.
  echo  Instale o Node.js em: https://nodejs.org
  echo  Baixe a versao LTS
  echo.
  pause
  exit /b 1
)

:: Instalar dependências do backend (se necessário)
if not exist "backend\node_modules" (
  echo  Instalando dependencias do backend...
  npm install --prefix backend
)

:: Instalar dependências do frontend (se necessário)
if not exist "frontend\node_modules" (
  echo  Instalando dependencias do frontend...
  npm install --prefix frontend
)

:: Build do frontend (se necessário)
if not exist "frontend\dist" (
  echo  Preparando o app pela primeira vez (pode demorar 1-2 min)...
  npm run build --prefix frontend
)

:: Popular banco de dados (só se vazio)
node backend\seed.js 2>nul

:: Iniciar o servidor
echo.
echo  Iniciando...
echo.
node backend\server.js

pause
