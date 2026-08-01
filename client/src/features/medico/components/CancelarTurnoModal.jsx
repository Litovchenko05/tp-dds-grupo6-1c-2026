import React, { useState } from 'react'

function CancelarTurnoModal({
  isOpen = false,
  onClose = () => {},
  onConfirm = () => {},
  loading = false,
}) {
  const [motivo, setMotivo] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null
  const confirmar = async () => {
    const motivoNormalizado = motivo.trim()
    if (!motivoNormalizado) {
      setError('Ingresá el motivo de la cancelación.')
      return
    }

    try {
      setError('')
      await onConfirm(motivoNormalizado)
      setMotivo('')
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo cancelar el turno.')
    }
  }

  const cerrar = () => {
    if (loading) return
    setMotivo('')
    setError('')
    onClose()
  }

  return (
    <div className="agenda-modal-overlay" role="dialog" aria-modal="true" aria-label="Cancelar turno">
      <div className="agenda-modal">
        <button type="button" className="agenda-modal__close" aria-label="Cerrar" onClick={cerrar}>
          ×
        </button>
        <h3>Cancelar turno</h3>
        <p>Indicá el motivo por el cual cancelás este turno.</p>
        <textarea
          value={motivo}
          onChange={(event) => setMotivo(event.target.value)}
          placeholder="Motivo de cancelación"
          disabled={loading}
          rows={4}
        />
        {error && <p className="agenda-feedback agenda-feedback--error">{error}</p>}
        <div className="agenda-modal__actions">
          <button type="button" onClick={cerrar} disabled={loading}>
            Volver
          </button>
          <button type="button" className="agenda-modal__accept" onClick={confirmar} disabled={loading}>
            {loading ? 'Cancelando...' : 'Confirmar cancelación'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CancelarTurnoModal
