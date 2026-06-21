import React from 'react'

function MarcarRealizadoModal({ isOpen = false, onClose = () => {}, onConfirm = () => {} }) {
  if (!isOpen) return null

  return (
    <div role="dialog" aria-modal="true" aria-label="Marcar turno como realizado">
      <h3>Marcar turno como realizado</h3>
      <p>Este es un modal base para confirmar el cambio de estado del turno.</p>
      <button type="button" onClick={onClose}>
        Cerrar
      </button>
      <button type="button" onClick={onConfirm}>
        Confirmar
      </button>
    </div>
  )
}

export default MarcarRealizadoModal
