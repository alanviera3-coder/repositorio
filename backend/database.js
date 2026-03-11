const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'demands.db');

const db = new Database(DB_PATH);

// Habilitar WAL mode para melhor performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Criar tabela de demandas
db.exec(`
  CREATE TABLE IF NOT EXISTS demands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    type TEXT NOT NULL CHECK(type IN ('manutencao', 'melhoria')),
    subtype TEXT CHECK(subtype IN ('corretiva', 'preventiva', 'melhoria')),
    status TEXT NOT NULL DEFAULT 'aberto'
      CHECK(status IN ('aberto', 'em_andamento', 'em_teste', 'concluido', 'cancelado')),
    priority TEXT NOT NULL DEFAULT 'normal'
      CHECK(priority IN ('urgente', 'alta', 'normal', 'baixa')),
    area TEXT DEFAULT '',
    requester TEXT DEFAULT '',
    assignee TEXT DEFAULT '',
    estimated_date TEXT DEFAULT NULL,
    completed_date TEXT DEFAULT NULL,
    notes TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT DEFAULT (datetime('now', 'localtime'))
  )
`);

// Trigger para atualizar updated_at automaticamente
db.exec(`
  CREATE TRIGGER IF NOT EXISTS update_demands_updated_at
  AFTER UPDATE ON demands
  BEGIN
    UPDATE demands SET updated_at = datetime('now', 'localtime') WHERE id = NEW.id;
  END
`);

module.exports = db;
