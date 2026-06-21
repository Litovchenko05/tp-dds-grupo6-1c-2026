import React from 'react'

const AgendaFiltros = ({ filtros, onChange }) => {
  return (
    <section className="agenda-filtros">
      <input
        type="text"
        name="paciente"
        placeholder="Buscar paciente..."
        value={filtros.paciente}
        onChange={onChange}
        aria-label="Buscar por paciente"
      />

      <input
        type="date"
        name="fecha"
        value={filtros.fecha}
        onChange={onChange}
        aria-label="Filtrar por fecha"
      />

      <select
        name="estado"
        value={filtros.estado}
        onChange={onChange}
        aria-label="Filtrar por estado"
      >
        <option value="">Todos los estados</option>
        <option value="CONFIRMADO">Confirmado</option>
        <option value="REALIZADO">Realizado</option>
        <option value="CANCELADO">Cancelado</option>
      </select>
    </section>
  )
}

export default AgendaFiltros
