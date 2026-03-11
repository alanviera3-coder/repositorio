#!/bin/bash
# Script de inicialização do DemandaPRO
# Duplo clique para iniciar o app

cd "$(dirname "$0")"

echo ""
echo "========================================="
echo "   DemandaPRO — Iniciando o app..."
echo "========================================="
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
  echo "❌ Node.js não encontrado!"
  echo ""
  echo "Instale o Node.js em: https://nodejs.org"
  echo "(baixe a versão LTS)"
  echo ""
  read -p "Pressione Enter para fechar..."
  exit 1
fi

# Instalar dependências do backend (se necessário)
if [ ! -d "backend/node_modules" ]; then
  echo "📦 Instalando dependências do backend..."
  npm install --prefix backend
fi

# Instalar dependências do frontend (se necessário)
if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Instalando dependências do frontend..."
  npm install --prefix frontend
fi

# Fazer o build do frontend (se necessário ou desatualizado)
if [ ! -d "frontend/dist" ]; then
  echo "🔨 Preparando o app pela primeira vez (pode demorar 1-2 min)..."
  npm run build --prefix frontend
fi

# Popular banco com dados de exemplo (só se estiver vazio)
node backend/seed.js 2>/dev/null

# Iniciar o servidor
echo ""
echo "🚀 Iniciando..."
echo ""
node backend/server.js
