import { useEffect, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Trash2, Calendar, User, MapPin, Clock } from 'lucide-react'
import { createDemand, updateDemand, deleteDemand } from '../api/demands'
import DemandForm from './DemandForm'
import { STATUS_CONFIG, PRIORITY_CONFIG, TYPE_CONFIG, SUBTYPE_CONFIG } from '../utils/constants'
import toast from 'react-hot-toast'

function formatDateTime(str) {
  if (!str) return '-'
  const d = new Date(str)
  return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

function formatDate(str) {
  if (!str) return '-'
  const [y, m, day] = str.split('-')
  return `${day}/${m}/${y}`
}

export default function DemandModal({ demand, onClose, mode = 'view' }) {
  const qc = useQueryClient()
  const overlayRef = useRef(null)
  const isNew = !demand
  const [editMode, setEditMode] = [
    mode === 'create' || mode === 'edit',
    () => {},
  ]

  // Close on ESC
  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [onClose])

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['demands'] })
    qc.invalidateQueries({ queryKey: ['stats'] })
  }

  const createMutation = useMutation({
    mutationFn: createDemand,
    onSuccess: () => { invalidate(); toast.success('Demanda criada!'); onClose() },
    onError: (e) => toast.error(e.response?.data?.error || 'Erro ao criar'),
  })

  const updateMutation = useMutation({
    mutationFn: updateDemand,
    onSuccess: () => { invalidate(); toast.success('Demanda atualizada!'); onClose() },
    onError: (e) => toast.error(e.response?.data?.error || 'Erro ao atualizar'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDemand,
    onSuccess: () => { invalidate(); toast.success('Demanda excluída'); onClose() },
    onError: (e) => toast.error(e.response?.data?.error || 'Erro ao excluir'),
  })

  const handleSubmit = (data) => {
    if (isNew) {
      createMutation.mutate(data)
    } else {
      updateMutation.mutate({ id: demand.id, ...data })
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Excluir "${demand.title}"? Esta ação não pode ser desfeita.`)) {
      deleteMutation.mutate(demand.id)
    }
  }

  const loading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  const statusCfg = demand ? STATUS_CONFIG[demand.status] : null
  const priorityCfg = demand ? PRIORITY_CONFIG[demand.priority] : null
  const typeCfg = demand ? TYPE_CONFIG[demand.type] : null
  const subtypeCfg = demand?.subtype ? SUBTYPE_CONFIG[demand.subtype] : null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-end"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-900 text-base">
            {isNew ? '✨ Nova Demanda' : (mode === 'edit' ? '✏️ Editar Demanda' : '📋 Detalhes da Demanda')}
          </h2>
          <div className="flex items-center gap-1">
            {demand && mode !== 'create' && (
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Excluir"
                disabled={loading}
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          {(isNew || mode === 'edit') ? (
            <DemandForm
              initialData={demand}
              onSubmit={handleSubmit}
              onCancel={onClose}
              loading={loading}
            />
          ) : (
            // View mode
            <div className="space-y-5">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {statusCfg && (
                  <span className={`badge ${statusCfg.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} mr-1.5`} />
                    {statusCfg.label}
                  </span>
                )}
                {priorityCfg && (
                  <span className={`badge ${priorityCfg.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${priorityCfg.dot} mr-1.5`} />
                    {priorityCfg.label}
                  </span>
                )}
                {typeCfg && (
                  <span className={`badge ${typeCfg.color}`}>
                    {typeCfg.icon} {typeCfg.label}
                  </span>
                )}
                {subtypeCfg && (
                  <span className={`badge ${subtypeCfg.color}`}>
                    {subtypeCfg.label}
                  </span>
                )}
              </div>

              {/* Title */}
              <div>
                <h3 className="text-xl font-bold text-gray-900">{demand.title}</h3>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {demand.area && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{demand.area}</span>
                  </div>
                )}
                {demand.requester && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <User size={14} className="text-gray-400" />
                    <span>Solicitante: {demand.requester}</span>
                  </div>
                )}
                {demand.assignee && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <User size={14} className="text-gray-400" />
                    <span>Responsável: {demand.assignee}</span>
                  </div>
                )}
                {demand.estimated_date && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={14} className="text-gray-400" />
                    <span>Previsto: {formatDate(demand.estimated_date)}</span>
                  </div>
                )}
                {demand.completed_date && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Calendar size={14} className="text-green-400" />
                    <span>Concluído: {formatDate(demand.completed_date)}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {demand.description && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Descrição</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{demand.description}</p>
                </div>
              )}

              {/* Notes */}
              {demand.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">Observações</p>
                  <p className="text-sm text-yellow-800 whitespace-pre-wrap">{demand.notes}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t border-gray-100 pt-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock size={11} />
                  <span>Criado em {formatDateTime(demand.created_at)}</span>
                </div>
                {demand.updated_at !== demand.created_at && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock size={11} />
                    <span>Atualizado em {formatDateTime(demand.updated_at)}</span>
                  </div>
                )}
              </div>

              {/* Edit button */}
              <button
                onClick={() => {
                  onClose()
                  // Reabrir em modo edição via prop externa não é possível aqui,
                  // então fazemos render do form diretamente
                }}
                className="hidden"
              />
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    // Trick: close and reopen with edit mode
                    const event = new CustomEvent('editDemand', { detail: demand })
                    window.dispatchEvent(event)
                    onClose()
                  }}
                  className="btn-primary"
                >
                  ✏️ Editar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
