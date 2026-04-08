import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  PRIORITY_OPTIONS,
  TYPE_OPTIONS,
  STATUS_OPTIONS,
  SUBTYPE_BY_TYPE,
  AREA_SUGGESTIONS,
} from '../utils/constants'

const defaultValues = {
  title: '',
  description: '',
  type: 'manutencao',
  subtype: 'corretiva',
  status: 'aberto',
  priority: 'normal',
  area: '',
  requester: '',
  assignee: '',
  estimated_date: '',
  notes: '',
}

export default function DemandForm({ initialData, onSubmit, onCancel, loading }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialData ? { ...defaultValues, ...initialData } : defaultValues })

  const watchedType = watch('type')
  const subtypeOptions = SUBTYPE_BY_TYPE[watchedType] || []

  // Quando tipo muda, resetar subtype para o primeiro da lista
  useEffect(() => {
    if (subtypeOptions.length > 0) {
      setValue('subtype', subtypeOptions[0].value)
    }
  }, [watchedType])

  const handleFormSubmit = (data) => {
    // Limpar campos vazios
    const cleaned = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v === '' ? null : v])
    )
    onSubmit(cleaned)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Título */}
      <div>
        <label className="form-label">Título <span className="text-red-500">*</span></label>
        <input
          {...register('title', { required: 'Título é obrigatório', maxLength: { value: 200, message: 'Máximo 200 caracteres' } })}
          className="form-input"
          placeholder="Descreva a demanda brevemente..."
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      {/* Tipo + Subtipo */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Tipo <span className="text-red-500">*</span></label>
          <select {...register('type', { required: true })} className="form-select">
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Subtipo</label>
          <select {...register('subtype')} className="form-select">
            {subtypeOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status + Prioridade */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Status</label>
          <select {...register('status')} className="form-select">
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Prioridade</label>
          <select {...register('priority')} className="form-select">
            {PRIORITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Área + Data estimada */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Área / Setor</label>
          <input
            {...register('area')}
            list="area-suggestions"
            className="form-input"
            placeholder="ex: TI, Predial, Elétrica..."
          />
          <datalist id="area-suggestions">
            {AREA_SUGGESTIONS.map((a) => <option key={a} value={a} />)}
          </datalist>
        </div>
        <div>
          <label className="form-label">Data estimada</label>
          <input
            {...register('estimated_date')}
            type="date"
            className="form-input"
          />
        </div>
      </div>

      {/* Solicitante + Responsável */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Solicitante</label>
          <input
            {...register('requester')}
            className="form-input"
            placeholder="Nome do solicitante"
          />
        </div>
        <div>
          <label className="form-label">Responsável</label>
          <input
            {...register('assignee')}
            className="form-input"
            placeholder="Nome do responsável"
          />
        </div>
      </div>

      {/* Descrição */}
      <div>
        <label className="form-label">Descrição</label>
        <textarea
          {...register('description')}
          rows={3}
          className="form-input resize-none"
          placeholder="Descreva detalhadamente a demanda..."
        />
      </div>

      {/* Observações */}
      <div>
        <label className="form-label">Observações</label>
        <textarea
          {...register('notes')}
          rows={2}
          className="form-input resize-none"
          placeholder="Informações adicionais, andamento, etc..."
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Salvando...' : (initialData ? 'Salvar alterações' : 'Criar demanda')}
        </button>
      </div>
    </form>
  )
}
