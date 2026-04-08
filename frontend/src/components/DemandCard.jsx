import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, User, MapPin, GripVertical } from 'lucide-react'
import { PRIORITY_CONFIG, TYPE_CONFIG, SUBTYPE_CONFIG } from '../utils/constants'

function formatDate(dateStr) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function isOverdue(dateStr, status) {
  if (!dateStr || ['concluido', 'cancelado'].includes(status)) return false
  return new Date(dateStr) < new Date()
}

export default function DemandCard({ demand, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: demand.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const priorityCfg = PRIORITY_CONFIG[demand.priority]
  const typeCfg = TYPE_CONFIG[demand.type]
  const subtypeCfg = demand.subtype ? SUBTYPE_CONFIG[demand.subtype] : null
  const overdue = isOverdue(demand.estimated_date, demand.status)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer group
        ${demand.priority === 'urgente' ? 'border-l-4 border-l-red-500 border-r border-t border-b border-gray-200' : 'border-gray-200'}
      `}
      onClick={() => onClick(demand)}
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className={`badge ${typeCfg.color} text-xs`}>
                {typeCfg.icon} {typeCfg.label}
              </span>
              {subtypeCfg && (
                <span className={`badge ${subtypeCfg.color} text-xs`}>
                  {subtypeCfg.label}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
              {demand.title}
            </h3>
          </div>

          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="mt-0.5 p-0.5 rounded text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={14} />
          </button>
        </div>

        {/* Priority badge */}
        <div className="mb-2">
          <span className={`badge ${priorityCfg.color} text-xs`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priorityCfg.dot} mr-1`} />
            {priorityCfg.label}
          </span>
        </div>

        {/* Meta info */}
        <div className="space-y-1">
          {demand.area && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={11} className="flex-shrink-0" />
              <span className="truncate">{demand.area}</span>
            </div>
          )}
          {demand.assignee && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <User size={11} className="flex-shrink-0" />
              <span className="truncate">{demand.assignee}</span>
            </div>
          )}
          {demand.estimated_date && (
            <div className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              <Calendar size={11} className="flex-shrink-0" />
              <span>{overdue ? '⚠ ' : ''}{formatDate(demand.estimated_date)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Versão estática (sem drag) para uso em outros contextos
export function DemandCardStatic({ demand, onClick }) {
  const priorityCfg = PRIORITY_CONFIG[demand.priority]
  const typeCfg = TYPE_CONFIG[demand.type]
  const subtypeCfg = demand.subtype ? SUBTYPE_CONFIG[demand.subtype] : null

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer
        ${demand.priority === 'urgente' ? 'border-l-4 border-l-red-500 border-r border-t border-b border-gray-200' : 'border-gray-200'}
      `}
      onClick={() => onClick && onClick(demand)}
    >
      <div className="p-3">
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          <span className={`badge ${typeCfg.color} text-xs`}>{typeCfg.icon} {typeCfg.label}</span>
          {subtypeCfg && <span className={`badge ${subtypeCfg.color} text-xs`}>{subtypeCfg.label}</span>}
        </div>
        <h3 className="text-sm font-semibold text-gray-800 mb-1">{demand.title}</h3>
        <span className={`badge ${priorityCfg.color} text-xs`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priorityCfg.dot} mr-1`} />
          {priorityCfg.label}
        </span>
      </div>
    </div>
  )
}
