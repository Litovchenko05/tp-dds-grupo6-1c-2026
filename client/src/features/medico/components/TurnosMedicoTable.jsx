import React from 'react'
import '../styles/turnosMedicoTable.css'

function TurnosMedicoTable() {
  return (
    <section className="turnos-medico-table">
      <div className="turnos-medico-table__header">
        <h2>Listado de turnos</h2>
      </div>

      <div className="turnos-medico-table__empty">
        <p>No hay turnos para mostrar por el momento.</p>
      </div>
    </section>
  )
}

export default TurnosMedicoTable
