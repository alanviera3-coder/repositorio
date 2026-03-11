// Script para popular o banco com dados de exemplo
const db = require('./database');

const demands = [
  {
    title: 'Substituição de ar-condicionado sala de reuniões',
    description: 'O ar-condicionado da sala de reuniões principal está com vazamento de gás e não refrigera adequadamente.',
    type: 'manutencao',
    subtype: 'corretiva',
    status: 'em_andamento',
    priority: 'alta',
    area: 'Predial',
    requester: 'Maria Silva',
    assignee: 'João Técnico',
    estimated_date: '2026-03-20',
    notes: 'Já solicitado orçamento com 3 empresas'
  },
  {
    title: 'Manutenção preventiva dos elevadores',
    description: 'Revisão semestral obrigatória dos elevadores do edifício conforme contrato de manutenção.',
    type: 'manutencao',
    subtype: 'preventiva',
    status: 'aberto',
    priority: 'normal',
    area: 'Predial',
    requester: 'Gerência',
    assignee: 'Empresa Elevadores SA',
    estimated_date: '2026-03-15',
    notes: ''
  },
  {
    title: 'Implantação de sistema de chamados de TI',
    description: 'Implementar ferramenta de help desk para centralizar e organizar os chamados de suporte técnico.',
    type: 'melhoria',
    subtype: 'melhoria',
    status: 'em_teste',
    priority: 'alta',
    area: 'TI',
    requester: 'Diretor TI',
    assignee: 'Equipe Dev',
    estimated_date: '2026-04-01',
    notes: 'Testando com grupo piloto de 10 usuários'
  },
  {
    title: 'Troca de lâmpadas por LED - bloco B',
    description: 'Substituição de todas as lâmpadas fluorescentes por LED para redução de consumo elétrico.',
    type: 'melhoria',
    subtype: 'melhoria',
    status: 'concluido',
    priority: 'baixa',
    area: 'Elétrica',
    requester: 'Sustentabilidade',
    assignee: 'Eletricista Paulo',
    estimated_date: '2026-02-28',
    completed_date: '2026-02-25',
    notes: 'Economia estimada de 30% no consumo'
  },
  {
    title: 'Vazamento na cozinha do 3º andar',
    description: 'Cano sob a pia da cozinha do 3º andar com vazamento. Está molhando o armário abaixo.',
    type: 'manutencao',
    subtype: 'corretiva',
    status: 'aberto',
    priority: 'urgente',
    area: 'Hidráulica',
    requester: 'Colaboradora Ana Costa',
    assignee: '',
    estimated_date: '2026-03-12',
    notes: 'Colocar bacia para coleta temporária'
  },
  {
    title: 'Revisão da rede elétrica do datacenter',
    description: 'Verificação e adequação da rede elétrica do datacenter para nova capacidade de servidores.',
    type: 'manutencao',
    subtype: 'preventiva',
    status: 'aberto',
    priority: 'urgente',
    area: 'Elétrica',
    requester: 'TI',
    assignee: 'Elétrica Especializada Ltda',
    estimated_date: '2026-03-25',
    notes: 'Necessário desligar servidores durante a revisão - agendar fora do horário comercial'
  },
  {
    title: 'Criação de portal do colaborador',
    description: 'Desenvolvimento de portal web para que colaboradores acessem holerites, solicitem férias e visualizem informações de RH.',
    type: 'melhoria',
    subtype: 'melhoria',
    status: 'aberto',
    priority: 'normal',
    area: 'TI',
    requester: 'RH',
    assignee: '',
    estimated_date: '2026-06-01',
    notes: 'Aguardando aprovação de orçamento'
  },
  {
    title: 'Pintura da fachada principal',
    description: 'A pintura da fachada principal está descascando em alguns pontos. Necessária revisão completa.',
    type: 'manutencao',
    subtype: 'corretiva',
    status: 'cancelado',
    priority: 'baixa',
    area: 'Predial',
    requester: 'Gerência Predial',
    assignee: 'Pinturas Express',
    estimated_date: '2026-02-15',
    notes: 'Cancelado devido ao período de chuvas. Reagendar para abril.'
  },
  {
    title: 'Upgrade dos computadores do setor financeiro',
    description: 'Troca de 15 computadores do setor financeiro que estão desatualizados e lentos, impactando a produtividade.',
    type: 'melhoria',
    subtype: 'melhoria',
    status: 'em_andamento',
    priority: 'alta',
    area: 'TI',
    requester: 'Financeiro',
    assignee: 'Compras + TI',
    estimated_date: '2026-03-30',
    notes: '8 computadores já chegaram, 7 ainda em trânsito'
  },
  {
    title: 'Calibração dos equipamentos de medição',
    description: 'Calibração anual obrigatória de todos os equipamentos de medição do laboratório de qualidade.',
    type: 'manutencao',
    subtype: 'preventiva',
    status: 'concluido',
    priority: 'alta',
    area: 'Qualidade',
    requester: 'Qualidade',
    assignee: 'Instituto Metrologia',
    estimated_date: '2026-02-20',
    completed_date: '2026-02-19',
    notes: 'Certificados emitidos e arquivados'
  }
];

// Verificar se já existem dados
const existingCount = db.prepare('SELECT COUNT(*) as count FROM demands').get().count;

if (existingCount === 0) {
  const stmt = db.prepare(`
    INSERT INTO demands (title, description, type, subtype, status, priority, area, requester, assignee, estimated_date, completed_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      stmt.run(
        item.title, item.description, item.type, item.subtype,
        item.status, item.priority, item.area, item.requester,
        item.assignee, item.estimated_date || null,
        item.completed_date || null, item.notes
      );
    }
  });

  insertMany(demands);
  console.log(`✅ ${demands.length} demandas de exemplo inseridas com sucesso!`);
} else {
  console.log(`ℹ️  Banco já contém ${existingCount} demandas. Seed ignorado.`);
}

process.exit(0);
