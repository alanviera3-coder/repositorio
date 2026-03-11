export const STATUS_CONFIG = {
  aberto: {
    label: 'Aberto',
    color: 'bg-slate-100 text-slate-700',
    dot: 'bg-slate-400',
    border: 'border-slate-300',
    header: 'bg-slate-50 border-slate-200',
  },
  em_andamento: {
    label: 'Em Andamento',
    color: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
    border: 'border-blue-200',
    header: 'bg-blue-50 border-blue-200',
  },
  em_teste: {
    label: 'Em Teste',
    color: 'bg-purple-100 text-purple-700',
    dot: 'bg-purple-500',
    border: 'border-purple-200',
    header: 'bg-purple-50 border-purple-200',
  },
  concluido: {
    label: 'Concluído',
    color: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
    border: 'border-green-200',
    header: 'bg-green-50 border-green-200',
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-700',
    dot: 'bg-red-400',
    border: 'border-red-200',
    header: 'bg-red-50 border-red-200',
  },
};

export const PRIORITY_CONFIG = {
  urgente: {
    label: 'Urgente',
    color: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
    badge: 'bg-red-500 text-white',
    ring: 'ring-red-500',
  },
  alta: {
    label: 'Alta',
    color: 'bg-orange-100 text-orange-700',
    dot: 'bg-orange-500',
    badge: 'bg-orange-500 text-white',
    ring: 'ring-orange-500',
  },
  normal: {
    label: 'Normal',
    color: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
    badge: 'bg-blue-500 text-white',
    ring: 'ring-blue-500',
  },
  baixa: {
    label: 'Baixa',
    color: 'bg-gray-100 text-gray-600',
    dot: 'bg-gray-400',
    badge: 'bg-gray-400 text-white',
    ring: 'ring-gray-400',
  },
};

export const TYPE_CONFIG = {
  manutencao: {
    label: 'Manutenção',
    color: 'bg-amber-100 text-amber-700',
    icon: '🔧',
  },
  melhoria: {
    label: 'Melhoria',
    color: 'bg-indigo-100 text-indigo-700',
    icon: '✨',
  },
};

export const SUBTYPE_CONFIG = {
  corretiva: { label: 'Corretiva', color: 'bg-red-50 text-red-600' },
  preventiva: { label: 'Preventiva', color: 'bg-yellow-50 text-yellow-700' },
  melhoria: { label: 'Melhoria', color: 'bg-indigo-50 text-indigo-600' },
};

export const KANBAN_COLUMNS = ['aberto', 'em_andamento', 'em_teste', 'concluido', 'cancelado'];

export const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(([value, cfg]) => ({
  value,
  label: cfg.label,
}));

export const PRIORITY_OPTIONS = [
  { value: 'urgente', label: '🔴 Urgente' },
  { value: 'alta', label: '🟠 Alta' },
  { value: 'normal', label: '🔵 Normal' },
  { value: 'baixa', label: '⚪ Baixa' },
];

export const TYPE_OPTIONS = [
  { value: 'manutencao', label: '🔧 Manutenção' },
  { value: 'melhoria', label: '✨ Melhoria' },
];

export const SUBTYPE_BY_TYPE = {
  manutencao: [
    { value: 'corretiva', label: 'Corretiva' },
    { value: 'preventiva', label: 'Preventiva' },
  ],
  melhoria: [
    { value: 'melhoria', label: 'Melhoria' },
  ],
};

export const AREA_SUGGESTIONS = [
  'TI', 'Predial', 'Elétrica', 'Hidráulica', 'Mecânica',
  'HVAC', 'Segurança', 'Qualidade', 'Financeiro', 'RH', 'Logística'
];
