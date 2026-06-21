import React from 'react'

const AgendaTurnosTable = ({ turnos }) => {
  if (!turnos.length) {
    return <p className="agenda-empty">No hay turnos para los filtros seleccionados.</p>
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
              <td>{turno.paciente}</td>
              <td>{turno.servicio}</td>
              <td>{turno.sede}</td>
              <td>{turno.estado}</td>
              <td className="agenda-actions">
                <button type="button">Marcar realizado</button>
                <button type="button" className="cancelar">
                  Cancelar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AgendaTurnosTable
