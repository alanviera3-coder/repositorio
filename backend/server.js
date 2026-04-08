const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');

// Inicializar banco antes de qualquer coisa
require('./database');

const demandsRouter = require('./routes/demands');
const statsRouter = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// API
app.use('/api/demands', demandsRouter);
app.use('/api/stats', statsRouter);
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Servir o frontend (pasta dist gerada pelo build)
const DIST = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(DIST));

// Qualquer rota não-API devolve o index.html (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Descobrir IP local para exibir no console
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const iface of Object.values(nets)) {
    for (const net of iface) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return 'localhost';
}

app.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log('\n✅ DemandaPRO está rodando!\n');
  console.log(`   💻 No computador: http://localhost:${PORT}`);
  console.log(`   📱 No celular:    http://${ip}:${PORT}`);
  console.log('\n   (celular e computador precisam estar na mesma rede Wi-Fi)');
  console.log('\n   Pressione Ctrl+C para encerrar.\n');
});

module.exports = app;
