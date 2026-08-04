import React from 'react'
import ActionMenu from '../../../../components/common/ActionMenu'
import '../../../../styles/sharedTables.css'

const AgendaTurnosTable = ({ turnos, onAction }) => {
  if (!turnos.length) {
    return <p className="agenda-empty">No hay turnos para los filtros seleccionados.</p>
  }

  const accionesPorEstado = (turno) => {
    const acciones = []
    if (turno.estado === 'CONFIRMADO' || turno.estado === 'RESERVADO') {
      acciones.push({
        label: 'Marcar como realizado',
        onClick: () => onAction('Marcar realizado', turno._id),
      })
    }
    if (
      turno.estado === 'CONFIRMADO' ||
      turno.estado === 'RESERVADO' ||
      turno.estado === 'DISPONIBLE'
    ) {
      acciones.push({ label: 'Cancelar', onClick: () => onAction('Cancelar', turno._id) })
    }
    if (turno.estado === 'CANCELADO') {
      acciones.push({
        label: 'Marcar como disponible',
        onClick: () => onAction('Marcar como disponible', turno._id),
      })
    }
    if (turno.estado !== 'DISPONIBLE') {
      acciones.push({
        label: 'Ver historial del paciente',
        onClick: () => onAction('Ver historial del paciente', turno._id),
      })
    }
    return acciones
  }

  return (
    <div className="agenda-table-wrapper">
      <table className="table">
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
            <tr key={turno._id} className={`estado-${turno.estado.toUpperCase()}`}>
              <td>{turno.fecha}</td>
              <td>{turno.hora}</td>
              <td>{turno.estado === 'DISPONIBLE' ? 'Sin Paciente' : turno.paciente}</td>
              <td>{turno.servicio}</td>
              <td>{turno.sede}</td>
              <td>{turno.estado}</td>
              <td className="agenda-actions">
                <ActionMenu
                  ariaLabel="Menú de acciones del turno"
                  actions={accionesPorEstado(turno)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AgendaTurnosTable
