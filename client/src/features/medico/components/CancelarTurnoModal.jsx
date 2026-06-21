import React from 'react'

function CancelarTurnoModal({ isOpen = false, onClose = () => {}, onConfirm = () => {} }) {
  if (!isOpen) return null

  return (
    <div role="dialog" aria-modal="true" aria-label="Cancelar turno">
      <h3>Cancelar turno</h3>
      <p>Este es un modal base para cancelar un turno con motivo.</p>
      <button type="button" onClick={onClose}>
        Cerrar
      </button>
      <button type="button" onClick={onConfirm}>
        Confirmar cancelación
      </button>
    </div>
  )
}

export default CancelarTurnoModal
