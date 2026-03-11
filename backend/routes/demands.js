const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/demands - listar com filtros opcionais
router.get('/', (req, res) => {
  try {
    const { status, type, priority, area, search } = req.query;

    let sql = 'SELECT * FROM demands WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }
    if (priority) {
      sql += ' AND priority = ?';
      params.push(priority);
    }
    if (area) {
      sql += ' AND area LIKE ?';
      params.push(`%${area}%`);
    }
    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ? OR requester LIKE ? OR assignee LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += " ORDER BY CASE priority WHEN 'urgente' THEN 1 WHEN 'alta' THEN 2 WHEN 'normal' THEN 3 WHEN 'baixa' THEN 4 END, created_at DESC";

    const demands = db.prepare(sql).all(...params);
    res.json(demands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/demands/:id - obter uma demanda
router.get('/:id', (req, res) => {
  try {
    const demand = db.prepare('SELECT * FROM demands WHERE id = ?').get(req.params.id);
    if (!demand) return res.status(404).json({ error: 'Demanda não encontrada' });
    res.json(demand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/demands - criar demanda
router.post('/', (req, res) => {
  try {
    const {
      title, description, type, subtype, status, priority,
      area, requester, assignee, estimated_date, notes
    } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: 'Título e tipo são obrigatórios' });
    }

    const stmt = db.prepare(`
      INSERT INTO demands (title, description, type, subtype, status, priority, area, requester, assignee, estimated_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title,
      description || '',
      type,
      subtype || null,
      status || 'aberto',
      priority || 'normal',
      area || '',
      requester || '',
      assignee || '',
      estimated_date || null,
      notes || ''
    );

    const created = db.prepare('SELECT * FROM demands WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/demands/:id - atualizar demanda completa
router.put('/:id', (req, res) => {
  try {
    const demand = db.prepare('SELECT * FROM demands WHERE id = ?').get(req.params.id);
    if (!demand) return res.status(404).json({ error: 'Demanda não encontrada' });

    const {
      title, description, type, subtype, status, priority,
      area, requester, assignee, estimated_date, completed_date, notes
    } = req.body;

    // Auto-set completed_date when status changes to concluido
    let finalCompletedDate = completed_date;
    if (status === 'concluido' && !demand.completed_date && !completed_date) {
      finalCompletedDate = new Date().toISOString().split('T')[0];
    } else if (status !== 'concluido') {
      finalCompletedDate = null;
    }

    db.prepare(`
      UPDATE demands SET
        title = ?, description = ?, type = ?, subtype = ?, status = ?, priority = ?,
        area = ?, requester = ?, assignee = ?, estimated_date = ?, completed_date = ?, notes = ?
      WHERE id = ?
    `).run(
      title ?? demand.title,
      description ?? demand.description,
      type ?? demand.type,
      subtype ?? demand.subtype,
      status ?? demand.status,
      priority ?? demand.priority,
      area ?? demand.area,
      requester ?? demand.requester,
      assignee ?? demand.assignee,
      estimated_date ?? demand.estimated_date,
      finalCompletedDate ?? demand.completed_date,
      notes ?? demand.notes,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM demands WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/demands/:id/status - atualizar apenas status (drag-drop Kanban)
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['aberto', 'em_andamento', 'em_teste', 'concluido', 'cancelado'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const demand = db.prepare('SELECT * FROM demands WHERE id = ?').get(req.params.id);
    if (!demand) return res.status(404).json({ error: 'Demanda não encontrada' });

    let completedDate = demand.completed_date;
    if (status === 'concluido' && !demand.completed_date) {
      completedDate = new Date().toISOString().split('T')[0];
    } else if (status !== 'concluido') {
      completedDate = null;
    }

    db.prepare('UPDATE demands SET status = ?, completed_date = ? WHERE id = ?')
      .run(status, completedDate, req.params.id);

    const updated = db.prepare('SELECT * FROM demands WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/demands/:id - excluir demanda
router.delete('/:id', (req, res) => {
  try {
    const demand = db.prepare('SELECT * FROM demands WHERE id = ?').get(req.params.id);
    if (!demand) return res.status(404).json({ error: 'Demanda não encontrada' });

    db.prepare('DELETE FROM demands WHERE id = ?').run(req.params.id);
    res.json({ message: 'Demanda excluída com sucesso', id: parseInt(req.params.id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
