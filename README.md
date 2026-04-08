# DemandaPRO — Controle de Demandas de Manutenção & Melhorias

App full-stack para gerenciar demandas de manutenção corretiva, preventiva e projetos de melhoria.

## Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + React Query
- **Backend**: Node.js + Express
- **Banco de dados**: SQLite (better-sqlite3)

## Funcionalidades

- **Kanban** — Visualização em colunas por status com drag & drop
- **Lista** — Tabela com busca e filtros avançados
- **Dashboard** — Métricas em tempo real com gráficos (Recharts)
- **CRUD completo** — Criar, editar, excluir demandas
- **Tipos**: Manutenção (corretiva / preventiva) e Melhoria
- **Prioridades**: Urgente, Alta, Normal, Baixa
- **Status**: Aberto → Em Andamento → Em Teste → Concluído / Cancelado

## Como rodar

### Pré-requisitos

- Node.js 18+
- npm

### Instalação

```bash
# Instalar dependências de ambos
npm run install:all

# Populat banco com dados de exemplo
npm run seed
```

### Desenvolvimento

```bash
# Terminal 1 — Backend (porta 3001)
npm run dev:backend

# Terminal 2 — Frontend (porta 5173)
npm run dev:frontend
```

Acesse: http://localhost:5173

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/demands` | Listar demandas |
| POST | `/api/demands` | Criar demanda |
| PUT | `/api/demands/:id` | Atualizar demanda |
| PATCH | `/api/demands/:id/status` | Atualizar status |
| DELETE | `/api/demands/:id` | Excluir demanda |
| GET | `/api/stats` | Estatísticas |
| GET | `/api/health` | Health check |

## Estrutura do projeto

```
repositorio/
├── backend/
│   ├── server.js         # Express app
│   ├── database.js       # SQLite setup
│   ├── seed.js           # Dados de exemplo
│   └── routes/
│       ├── demands.js    # CRUD API
│       └── stats.js      # Dashboard stats
└── frontend/
    ├── src/
    │   ├── api/          # Axios calls
    │   ├── components/   # Componentes React
    │   ├── pages/        # Páginas (Kanban, Lista, Dashboard)
    │   └── utils/        # Constantes e configurações
    └── vite.config.js
```
