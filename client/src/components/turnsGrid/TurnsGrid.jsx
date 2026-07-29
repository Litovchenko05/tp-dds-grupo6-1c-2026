import { useEffect, useState } from 'react'
import './TurnsGrid.css'
import { getTurns, getTurnsFiltered } from '../../service/turnsService.js'
import TurnItem from '../turnItem/TurnItem'
import Paginacion from '../paginacion/Paginacion.jsx'
import { Spinner } from 'react-bootstrap'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'

export default function TurnsGrid({ filtros }) {
  const [turnos, setTurnos] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [cargando, setCargando] = useState(false)

  const [sortBy, setSortBy] = useState('fecha')
  const [order, setOrder] = useState('asc')

  const cargarTurnos = async (page = 1) => {
    setCargando(true)
    try {
      let turnosCargados

      if (filtros === null) {
        turnosCargados = await getTurns(page, { sortBy, order })
      } else {
        turnosCargados = await getTurnsFiltered({
          ...filtros,
          page,
          limit: 8,
          sortBy,
          order,
        })
      }
      setTurnos(turnosCargados.data.turnos)
      setPaginaActual(page)
      setTotalPaginas(turnosCargados.data.totalPages)
    } catch (error) {
      throw error
    } finally {
      setCargando(false)
    }
  }
  //para que cuando se monte el componente, cargue los turnos
  useEffect(() => {
    cargarTurnos(1)
  }, [filtros, sortBy, order])

  const handleOrdenar = (columna) => {
    if (sortBy === columna) {
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(columna)
      setOrder('asc')
    }
  }

  const iconoOrden = (columna) => {
    if (sortBy !== columna) return <FaSort className="sort-icon" />
    return order === 'asc' ? (
      <FaSortUp className="sort-icon active" />
    ) : (
      <FaSortDown className="sort-icon active" />
    )
  }

  return (
    <div className="turnos-container">
      <div className="tabla-container">
        <table className="servicios-table">
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Médico</th>
              <th>Sede</th>
              <th onClick={() => handleOrdenar('fecha')} className="sortable-header">
                Fecha {iconoOrden('fecha')}
              </th>
              <th>Hora</th>
              <th onClick={() => handleOrdenar('costo')} className="sortable-header">
                Costo {iconoOrden('costo')}
              </th>
              <th>Cobertura</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {cargando && turnos.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="spinner-contenedor">
                    <Spinner animation="border" />
                  </div>
                </td>
              </tr>
            ) : (
              turnos.map((turno) => <TurnItem key={turno._id} turno={turno} />)
            )}
          </tbody>
        </table>
      </div>
      <div className="paginacion">
        <Paginacion
          paginaActual={paginaActual}
          totalDePaginas={totalPaginas}
          cambioDePagina={(page) => cargarTurnos(page)}
        />
      </div>
    </div>
  )
}
