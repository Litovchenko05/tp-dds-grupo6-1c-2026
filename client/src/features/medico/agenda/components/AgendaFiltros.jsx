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

      <div className="agenda-filtro-fecha">
        <select
          name="tipoFecha"
          value={filtros.tipoFecha}
          onChange={onChange}
          aria-label="Filtrar por período de fecha"
        >
          <option value="">Sin filtro de fecha</option>
          <option value="HOY">Hoy</option>
          <option value="SEMANA">Esta semana</option>
          <option value="MES">Este mes</option>
          <option value="RANGO">Rango de fechas</option>
          <option value="ESPECIFICA">Fecha específica</option>
        </select>

        {filtros.tipoFecha === 'ESPECIFICA' && (
          <div className="agenda-rango-fechas">
            <label htmlFor="fechaEspecifica">Fecha</label>
            <input
              id="fechaEspecifica"
              type="date"
              name="fecha"
              value={filtros.fecha}
              onChange={onChange}
              aria-label="Filtrar por fecha específica"
            />
          </div>
        )}

        {filtros.tipoFecha === 'RANGO' && (
          <div className="agenda-rango-fechas">
            <div className="agenda-rango-fechas__field">
              <label htmlFor="fechaDesde">Desde</label>
              <input
                id="fechaDesde"
                type="date"
                name="fechaDesde"
                value={filtros.fechaDesde}
                onChange={onChange}
                aria-label="Filtrar desde fecha"
              />
            </div>
            <div className="agenda-rango-fechas__field">
              <label htmlFor="fechaHasta">Hasta</label>
              <input
                id="fechaHasta"
                type="date"
                name="fechaHasta"
                value={filtros.fechaHasta}
                onChange={onChange}
                aria-label="Filtrar hasta fecha"
              />
            </div>
          </div>
        )}
      </div>

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
