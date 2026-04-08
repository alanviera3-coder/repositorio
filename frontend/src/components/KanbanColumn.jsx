import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import DemandCard from './DemandCard'
import { STATUS_CONFIG } from '../utils/constants'

export default function KanbanColumn({ status, demands, onCardClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const config = STATUS_CONFIG[status]

  return (
    <div className="flex flex-col min-w-[260px] w-[260px] flex-shrink-0">
      {/* Column header */}
      <div className={`flex items-center justify-between px-3 py-2 rounded-t-xl border ${config.header}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
          <span className="text-sm font-semibold text-gray-700">{config.label}</span>
        </div>
        <span className={`badge text-xs ${config.color}`}>{demands.length}</span>
      </div>

      {/* Cards container */}
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[120px] p-2 rounded-b-xl border-l border-r border-b transition-colors overflow-y-auto
          ${config.border}
          ${isOver ? 'bg-blue-50/60' : 'bg-gray-50/80'}
        `}
        style={{ maxHeight: 'calc(100vh - 180px)' }}
      >
        <SortableContext
          items={demands.map((d) => d.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {demands.map((demand) => (
              <DemandCard
                key={demand.id}
                demand={demand}
                onClick={onCardClick}
              />
            ))}

            {demands.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <span className="text-2xl mb-1">📭</span>
                <span className="text-xs">Sem demandas</span>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}
