import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, RefreshCw, Filter } from 'lucide-react'
import { fetchDemands } from '../api/demands'
import KanbanBoard from '../components/KanbanBoard'
import DemandModal from '../components/DemandModal'
import { TYPE_OPTIONS, PRIORITY_OPTIONS } from '../utils/constants'

export default function KanbanPage() {
  const [modal, setModal] = useState(null) // null | { mode: 'create'|'view'|'edit', demand?: obj }
  const [filters, setFilters] = useState({ type: '', priority: '' })
  const [showFilters, setShowFilters] = useState(false)

  const { data: demands = [], isLoading, refetch } = useQuery({
    queryKey: ['demands', filters],
    queryFn: () => fetchDemands(filters),
  })

  // Escutar evento de "editar" disparado pelo modal de visualização
  useEffect(() => {
    const handler = (e) => setModal({ mode: 'edit', demand: e.detail })
    window.addEventListener('editDemand', handler)
    return () => window.removeEventListener('editDemand', handler)
  }, [])

  const handleCardClick = (demand) => {
    setModal({ mode: 'view', demand })
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary text-xs py-1.5 px-2.5 ${activeFiltersCount > 0 ? 'ring-2 ring-blue-400' : ''}`}
          >
            <Filter size={13} />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {showFilters && (
            <div className="flex items-center gap-2">
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
                <button
                  onClick={() => setFilters({ type: '', priority: '' })}
                  className="text-xs text-red-500 hover:underline"
                >
                  Limpar
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{demands.length} demanda{demands.length !== 1 ? 's' : ''}</span>
          <button onClick={() => refetch()} className="btn-secondary text-xs py-1.5 px-2.5" title="Atualizar">
            <RefreshCw size={13} />
          </button>
          <button onClick={() => setModal({ mode: 'create' })} className="btn-primary text-xs py-1.5">
            <Plus size={14} />
            Nova Demanda
          </button>
        </div>
      </div>

      {/* Kanban */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">Carregando demandas...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <KanbanBoard
            demands={demands}
            onCardClick={handleCardClick}
          />
        </div>
      )}

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
