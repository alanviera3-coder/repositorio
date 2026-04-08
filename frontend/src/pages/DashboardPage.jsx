import { useQuery } from '@tanstack/react-query'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LineChart, Line
} from 'recharts'
import {
  ClipboardList, AlertTriangle, Clock, CheckCircle2, TrendingUp, BarChart2
} from 'lucide-react'
import { fetchStats } from '../api/demands'
import { STATUS_CONFIG, PRIORITY_CONFIG, TYPE_CONFIG } from '../utils/constants'
import { DemandCardStatic } from '../components/DemandCard'
import { useState } from 'react'
import DemandModal from '../components/DemandModal'

const STATUS_COLORS = {
  aberto: '#94a3b8',
  em_andamento: '#3b82f6',
  em_teste: '#a855f7',
  concluido: '#22c55e',
  cancelado: '#ef4444',
}

const PRIORITY_COLORS = {
  urgente: '#ef4444',
  alta: '#f97316',
  normal: '#3b82f6',
  baixa: '#9ca3af',
}

function StatCard({ title, value, subtitle, icon: Icon, color, bg }) {
  return (
    <div className={`card p-5 flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
        {label && <p className="font-semibold text-gray-700 mb-1">{label}</p>}
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  })

  const [selectedDemand, setSelectedDemand] = useState(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const statusData = stats.by_status.map((s) => ({
    name: STATUS_CONFIG[s.status]?.label || s.status,
    value: s.count,
    fill: STATUS_COLORS[s.status] || '#ccc',
  }))

  const priorityData = stats.by_priority.map((p) => ({
    name: PRIORITY_CONFIG[p.priority]?.label || p.priority,
    value: p.count,
    fill: PRIORITY_COLORS[p.priority] || '#ccc',
  }))

  const typeData = stats.by_type.map((t) => ({
    name: TYPE_CONFIG[t.type]?.label || t.type,
    value: t.count,
  }))

  const areaData = stats.by_area.slice(0, 8).map((a) => ({
    name: a.area || 'Sem área',
    count: a.count,
  }))

  const monthData = stats.by_month.map((m) => ({
    name: m.month,
    Abertas: m.total,
    Concluídas: m.concluidas,
  }))

  const openCount = stats.by_status.find((s) => s.status === 'aberto')?.count || 0
  const inProgressCount = stats.by_status.find((s) => s.status === 'em_andamento')?.count || 0
  const doneCount = stats.by_status.find((s) => s.status === 'concluido')?.count || 0

  return (
    <div className="overflow-y-auto h-[calc(100vh-56px)] p-5 space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Demandas"
          value={stats.total}
          icon={ClipboardList}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          title="Urgentes Abertas"
          value={stats.urgent_open}
          subtitle="Requerem atenção imediata"
          icon={AlertTriangle}
          color="text-red-600"
          bg="bg-red-50"
        />
        <StatCard
          title="Em Andamento"
          value={inProgressCount}
          subtitle={`${openCount} aguardando`}
          icon={Clock}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          title="Taxa de Conclusão"
          value={`${stats.completion_rate}%`}
          subtitle={`${doneCount} concluídas`}
          icon={CheckCircle2}
          color="text-green-600"
          bg="bg-green-50"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Status Pie */}
        <div className="card p-5 lg:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart2 size={16} className="text-gray-400" /> Por Status
          </h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
              Nenhum dado disponível
            </div>
          )}
        </div>

        {/* Priority Bar */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-gray-400" /> Por Prioridade
          </h3>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={priorityData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Demandas" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
              Nenhum dado disponível
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Por Área */}
        {areaData.length > 0 && (
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Por Área / Setor</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={areaData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Demandas" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tendência mensal */}
        {monthData.length > 0 && (
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-gray-400" /> Evolução Mensal
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
                <Line type="monotone" dataKey="Abertas" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Concluídas" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tipo: Manutenção vs Melhoria */}
        {typeData.length > 0 && (
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Manutenção vs Melhoria</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  <Cell fill="#f59e0b" />
                  <Cell fill="#6366f1" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Últimas demandas */}
      {stats.recent && stats.recent.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Últimas Demandas Criadas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {stats.recent.map((d) => (
              <DemandCardStatic key={d.id} demand={d} onClick={setSelectedDemand} />
            ))}
          </div>
        </div>
      )}

      {/* Modal de visualização */}
      {selectedDemand && (
        <DemandModal
          demand={selectedDemand}
          mode="view"
          onClose={() => setSelectedDemand(null)}
        />
      )}
    </div>
  )
}
