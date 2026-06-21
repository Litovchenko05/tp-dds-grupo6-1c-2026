import React, { useState } from 'react'

const AgendaTurnosTable = ({ turnos, onAction }) => {
  const [menuOpenId, setMenuOpenId] = useState(null)

  if (!turnos.length) {
    return <p className="agenda-empty">No hay turnos para los filtros seleccionados.</p>
  }

  const toggleMenu = (turnoId) => {
    setMenuOpenId((prev) => (prev === turnoId ? null : turnoId))
  }

  const ejecutarAccion = (accion, turnoId) => {
    onAction?.(accion, turnoId)
    setMenuOpenId(null)
  }

  return (
    <div className="agenda-table-wrapper">
      <table className="agenda-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Paciente</th>
            <th>Servicio</th>
            <th>Sede</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((turno) => (
            <tr key={turno.id} className={`estado-${turno.estado.toLowerCase()}`}>
              <td>{turno.fecha}</td>
              <td>{turno.hora}</td>
              <td>{turno.estado === 'DISPONIBLE' ? 'Sin Paciente' : turno.paciente}</td>
              <td>{turno.servicio}</td>
              <td>{turno.sede}</td>
              <td>{turno.estado}</td>
              <td className="agenda-actions">
                <div className="agenda-table-menu-container">
                  <button
                    type="button"
                    className="agenda-table-menu-trigger"
                    aria-label="Abrir acciones del turno"
                    onClick={() => toggleMenu(turno.id)}
                  >
                    ⋮
                  </button>

                  {menuOpenId === turno.id && (
                    <div className="agenda-table-menu" role="menu" aria-label="Acciones del turno">
                      {turno.estado === 'CONFIRMADO' && (
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => ejecutarAccion('Marcar realizado', turno.id)}
                        >
                          Marcar como realizado
                        </button>
                      )}

                      {(turno.estado === 'CONFIRMADO' || turno.estado === 'DISPONIBLE') && (
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => ejecutarAccion('Cancelar', turno.id)}
                        >
                          Cancelar
                        </button>
                      )}

                      {turno.estado === 'CANCELADO' && turno.permiteReactivarDisponible && (
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => ejecutarAccion('Marcar como disponible', turno.id)}
                        >
                          Marcar como disponible
                        </button>
                      )}

                      {turno.estado === 'REALIZADO' ? (
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => ejecutarAccion('Ver perfil del paciente', turno.id)}
                        >
                          Ver perfil del paciente
                        </button>
                      ) : (
                        turno.estado !== 'DISPONIBLE' && (
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => ejecutarAccion('Ver perfil del paciente', turno.id)}
                          >
                            Ver perfil del paciente
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AgendaTurnosTable
