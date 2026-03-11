import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react'
import { fetchDemands } from '../api/demands'
import DemandModal from '../components/DemandModal'
import {
  STATUS_CONFIG, PRIORITY_CONFIG, TYPE_CONFIG, SUBTYPE_CONFIG,
  TYPE_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS
} from '../utils/constants'

function formatDate(str) {
  if (!str) return '—'
  const [y, m, d] = str.split('-')
  return `${d}/${m}/${y}`
}

export default function ListPage() {
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ type: '', priority: '', status: '' })
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')

  const { data: demands = [], isLoading, refetch } = useQuery({
    queryKey: ['demands', { ...filters, search }],
    queryFn: () => fetchDemands({ ...filters, search }),
  })

  // Listen for edit event
  const [_, setForceUpdate] = useState(0)
  useState(() => {
    const handler = (e) => setModal({ mode: 'edit', demand: e.detail })
    window.addEventListener('editDemand', handler)
    return () => window.removeEventListener('editDemand', handler)
  })

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortBy(col); setSortDir('asc') }
  }

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <ChevronUp size={12} className="text-gray-300" />
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-blue-500" />
      : <ChevronDown size={12} className="text-blue-500" />
  }

  const PRIORITY_ORDER = { urgente: 0, alta: 1, normal: 2, baixa: 3 }

  const sorted = [...demands].sort((a, b) => {
    let av = a[sortBy], bv = b[sortBy]
    if (sortBy === 'priority') { av = PRIORITY_ORDER[av]; bv = PRIORITY_ORDER[bv] }
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const clearFilters = () => {
    setFilters({ type: '', priority: '', status: '' })
    setSearch('')
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (search ? 1 : 0)

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-white border-b border-gray-100">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar demandas..."
            className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-56"
          />
        </div>

        {/* Filters */}
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todos os status</option>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todos os tipos</option>
          {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todas as prioridades</option>
          {PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {activeFiltersCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-red-500 hover:underline">
            Limpar ({activeFiltersCount})
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-400">{sorted.length} resultado{sorted.length !== 1 ? 's' : ''}</span>
          <button onClick={() => refetch()} className="btn-secondary text-xs py-1.5 px-2.5">
            <RefreshCw size={13} />
          </button>
          <button onClick={() => setModal({ mode: 'create' })} className="btn-primary text-xs py-1.5">
            <Plus size={14} />
            Nova Demanda
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <span className="text-4xl mb-2">📭</span>
            <p className="text-sm">Nenhuma demanda encontrada</p>
            <button onClick={() => setModal({ mode: 'create' })} className="btn-primary text-sm mt-3">
              <Plus size={14} /> Criar demanda
            </button>
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {[
                  { key: 'title', label: 'Título', w: 'w-auto' },
                  { key: 'type', label: 'Tipo', w: 'w-28' },
                  { key: 'status', label: 'Status', w: 'w-32' },
                  { key: 'priority', label: 'Prioridade', w: 'w-28' },
                  { key: 'area', label: 'Área', w: 'w-24' },
                  { key: 'assignee', label: 'Responsável', w: 'w-32' },
                  { key: 'estimated_date', label: 'Previsão', w: 'w-24' },
                  { key: 'created_at', label: 'Criado em', w: 'w-28' },
                ].map(({ key, label, w }) => (
                  <th
                    key={key}
                    className={`${w} px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none border-b border-gray-200`}
                    onClick={() => toggleSort(key)}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      <SortIcon col={key} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((d) => {
                const statusCfg = STATUS_CONFIG[d.status]
                const priorityCfg = PRIORITY_CONFIG[d.priority]
                const typeCfg = TYPE_CONFIG[d.type]
                return (
                  <tr
                    key={d.id}
                    onClick={() => setModal({ mode: 'view', demand: d })}
                    className={`hover:bg-blue-50/40 cursor-pointer transition-colors
                      ${d.priority === 'urgente' ? 'bg-red-50/30' : 'bg-white'}
                    `}
                  >
                    <td className="px-3 py-2.5 font-medium text-gray-800 max-w-xs truncate">{d.title}</td>
                    <td className="px-3 py-2.5">
                      <span className={`badge ${typeCfg.color} text-xs`}>
                        {typeCfg.icon} {typeCfg.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`badge ${statusCfg.color} text-xs`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} mr-1`} />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`badge ${priorityCfg.color} text-xs`}>
                        {priorityCfg.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-600 truncate max-w-[96px]">{d.area || '—'}</td>
                    <td className="px-3 py-2.5 text-gray-600 truncate max-w-[128px]">{d.assignee || '—'}</td>
                    <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{formatDate(d.estimated_date)}</td>
                    <td className="px-3 py-2.5 text-gray-400 whitespace-nowrap">
                      {new Date(d.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <DemandModal
          demand={modal.demand}
          mode={modal.mode}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
