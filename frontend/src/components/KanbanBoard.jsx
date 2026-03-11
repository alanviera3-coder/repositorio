import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { useQueryClient } from '@tanstack/react-query'
import { updateDemandStatus } from '../api/demands'
import KanbanColumn from './KanbanColumn'
import DemandCard from './DemandCard'
import { KANBAN_COLUMNS } from '../utils/constants'
import toast from 'react-hot-toast'

export default function KanbanBoard({ demands, onCardClick }) {
  const queryClient = useQueryClient()
  const [activeDemand, setActiveDemand] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  // Agrupar por status
  const grouped = KANBAN_COLUMNS.reduce((acc, status) => {
    acc[status] = demands.filter((d) => d.status === status)
    return acc
  }, {})

  const handleDragStart = ({ active }) => {
    const demand = demands.find((d) => d.id === active.id)
    setActiveDemand(demand)
  }

  const handleDragEnd = async ({ active, over }) => {
    setActiveDemand(null)
    if (!over) return

    const draggedId = active.id
    // O over pode ser um card (id = demand.id) ou uma coluna (id = status string)
    let newStatus = over.id

    // Se o destino é um card, pegar o status do container (coluna)
    if (typeof newStatus === 'number') {
      const overDemand = demands.find((d) => d.id === newStatus)
      if (overDemand) newStatus = overDemand.status
    }

    if (!KANBAN_COLUMNS.includes(newStatus)) return

    const draggedDemand = demands.find((d) => d.id === draggedId)
    if (!draggedDemand || draggedDemand.status === newStatus) return

    // Atualizar otimisticamente
    queryClient.setQueryData(['demands', {}], (old) => {
      if (!old) return old
      return old.map((d) => d.id === draggedId ? { ...d, status: newStatus } : d)
    })

    try {
      await updateDemandStatus({ id: draggedId, status: newStatus })
      queryClient.invalidateQueries({ queryKey: ['demands'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    } catch {
      // Reverter em caso de erro
      queryClient.invalidateQueries({ queryKey: ['demands'] })
      toast.error('Erro ao mover demanda')
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 p-4 overflow-x-auto h-full">
        {KANBAN_COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            demands={grouped[status] || []}
            onCardClick={onCardClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeDemand ? (
          <div className="rotate-2 scale-105 opacity-90">
            <DemandCard demand={activeDemand} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
