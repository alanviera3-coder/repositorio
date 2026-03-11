const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/stats - estatísticas para o dashboard
router.get('/', (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) as count FROM demands').get().count;

    const byStatus = db.prepare(`
      SELECT status, COUNT(*) as count FROM demands GROUP BY status ORDER BY count DESC
    `).all();

    const byType = db.prepare(`
      SELECT type, COUNT(*) as count FROM demands GROUP BY type ORDER BY count DESC
    `).all();

    const byPriority = db.prepare(`
      SELECT priority, COUNT(*) as count FROM demands
      GROUP BY priority
      ORDER BY CASE priority WHEN 'urgente' THEN 1 WHEN 'alta' THEN 2 WHEN 'normal' THEN 3 WHEN 'baixa' THEN 4 END
    `).all();

    const bySubtype = db.prepare(`
      SELECT subtype, COUNT(*) as count FROM demands WHERE subtype IS NOT NULL GROUP BY subtype ORDER BY count DESC
    `).all();

    const byArea = db.prepare(`
      SELECT area, COUNT(*) as count FROM demands WHERE area != '' GROUP BY area ORDER BY count DESC LIMIT 10
    `).all();

    // Demandas abertas urgentes
    const urgentOpen = db.prepare(`
      SELECT COUNT(*) as count FROM demands WHERE priority = 'urgente' AND status NOT IN ('concluido', 'cancelado')
    `).get().count;

    // Demandas por mês (últimos 6 meses)
    const byMonth = db.prepare(`
      SELECT
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'concluido' THEN 1 ELSE 0 END) as concluidas
      FROM demands
      WHERE created_at >= date('now', '-6 months')
      GROUP BY month
      ORDER BY month ASC
    `).all();

    // Taxa de conclusão
    const concluidas = db.prepare(`SELECT COUNT(*) as count FROM demands WHERE status = 'concluido'`).get().count;
    const completionRate = total > 0 ? Math.round((concluidas / total) * 100) : 0;

    // Últimas 5 demandas criadas
    const recent = db.prepare(`
      SELECT id, title, type, subtype, status, priority, area, created_at
      FROM demands
      ORDER BY created_at DESC
      LIMIT 5
    `).all();

    res.json({
      total,
      urgent_open: urgentOpen,
      completion_rate: completionRate,
      by_status: byStatus,
      by_type: byType,
      by_priority: byPriority,
      by_subtype: bySubtype,
      by_area: byArea,
      by_month: byMonth,
      recent
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
