import React, { useState } from 'react'

const AgendaTurnoCard = ({ turno, onAction }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showCancelarConfirm, setShowCancelarConfirm] = useState(false)

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  const ejecutarAccion = (accion) => {
    if (accion === 'Cancelar') {
      setShowCancelarConfirm(true)
      setMenuOpen(false)
      return
    }

    if (onAction) onAction(accion, turno._id)
    setMenuOpen(false)
  }

  const confirmarCancelacion = () => {
    if (onAction) onAction('Cancelar', turno._id)
    setShowCancelarConfirm(false)
  }

  const cerrarModalCancelacion = () => {
    setShowCancelarConfirm(false)
  }

  return (
    <article className={`agenda-card estado-${turno.estado.toUpperCase()}`}>
      <header className="agenda-card__header">
        <h3>{turno.estado === 'DISPONIBLE' ? 'Sin Paciente' : turno.paciente}</h3>
        <div className="agenda-card__menu-container">
          <button
            type="button"
            className="agenda-card__menu-trigger"
            aria-label="Abrir acciones del turno"
            onClick={toggleMenu}
          >
            ⋮
          </button>

          {menuOpen && (
            <div className="agenda-card__menu" role="menu" aria-label="Acciones del turno">
              {turno.estado === 'CONFIRMADO' && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => ejecutarAccion('Marcar realizado')}
                >
                  Marcar como realizado
                </button>
              )}

              {(turno.estado === 'CONFIRMADO' || turno.estado === 'DISPONIBLE') && (
                <button type="button" role="menuitem" onClick={() => ejecutarAccion('Cancelar')}>
                  Cancelar
                </button>
              )}

              {turno.estado === 'CANCELADO' && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => ejecutarAccion('Marcar como disponible')}
                >
                  Marcar como disponible
                </button>
              )}

              {turno.estado === 'REALIZADO' && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => ejecutarAccion('Ver historial del paciente')}
                >
                  Ver historial del paciente
                </button>
              )}

              {turno.estado !== 'DISPONIBLE' && turno.estado !== 'REALIZADO' && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => ejecutarAccion('Ver historial del paciente')}
                >
                  Ver historial del paciente
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="agenda-card__content-grid">
        <div className="agenda-card__col">
          <p>
            <strong>Servicio:</strong> {turno.servicio}
          </p>
          <p>
            <strong>Sede:</strong> {turno.sede}
          </p>
        </div>

        <div className="agenda-card__col">
          <p>
            <strong>Fecha:</strong> {turno.fecha}
          </p>
          <p>
            <strong>Horario:</strong> {turno.hora}
          </p>
        </div>
      </div>

      <div className="agenda-card__footer">
        <span className="agenda-card__estado">{turno.estado}</span>
      </div>

      {showCancelarConfirm && (
        <div
          className="agenda-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar cancelación"
        >
          <div className="agenda-modal">
            <button
              type="button"
              className="agenda-modal__close"
              aria-label="Descartar cancelación"
              onClick={cerrarModalCancelacion}
            >
              ×
            </button>
            <p>¿Está seguro que quiere cancelar este turno?</p>
            <button type="button" className="agenda-modal__accept" onClick={confirmarCancelacion}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

export default AgendaTurnoCard
