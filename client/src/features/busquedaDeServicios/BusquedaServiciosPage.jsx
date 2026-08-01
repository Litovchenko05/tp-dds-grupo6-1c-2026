import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import './BusquedaServiciosPage.css'
import { Link } from 'react-router-dom'
import { FaSearch, FaStethoscope, FaMicroscope } from 'react-icons/fa'
import Button from '@mui/material/Button'
import { getEspecialidades, getPracticas } from '../../service/serviciosService.js'
import { getTodosLosServicios } from '../../service/serviciosService.js'
import Paginacion from '../../components/paginacion/Paginacion.jsx'

const BusquedaServiciosPage = () => {
  const [menuAbierto, setMenuAbierto] = useState(null)

  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState('')
  const [practicaSeleccionada, setPracticaSeleccionada] = useState('')

  const [especialidades, setEspecialidades] = useState([])
  const [practicas, setPracticas] = useState([])

  const [servicios, setServicios] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  const menuRef = useRef(null)

  const abrirMenu = (id) => {
    setMenuAbierto(menuAbierto === id ? null : id)
  }

  useEffect(() => {
    function cerrarMenu(event) {
      if (!event.target.closest('.acciones-menu') && !event.target.closest('.menu-button')) {
        setMenuAbierto(null)
      }
    }

    document.addEventListener('mousedown', cerrarMenu)
    return () => document.removeEventListener('mousedown', cerrarMenu)
  }, [])

  useEffect(() => {
    const cargarDatos = async () => {
      const [especialidades, practicas] = await Promise.all([getEspecialidades(), getPracticas()])

      setEspecialidades(especialidades.data)
      setPracticas(practicas.data)
    }

    cargarDatos()
  }, [])

  const cargarServicios = async (page = 1) => {
    try {
      const respuesta = await getTodosLosServicios(
        page,
        especialidadSeleccionada,
        practicaSeleccionada
      )
      const { turnos, totalPages } = respuesta.data

      setServicios(turnos)
      setPaginaActual(page)
      setTotalPaginas(totalPages)
    } catch (error) {
      console.error('Error cargando servicios:', error)
    }
  }

  useEffect(() => {
    cargarServicios(1)
  }, [])

  const textoEstado = {
    especialidad: 'Especialidad',
    practica: 'Practica',
  }

  return (
    <Box className="app-view-container">
      <div className="servicios-filtros">
        <Typography variant="h4" className="page-title">
          Búsqueda de servicios
        </Typography>

        <div className="filtros-container">
          <label className="filtro-label">Filtrar por especialidad</label>

          <div className="input-wrapper">
            <FaStethoscope className="search-icon" />
            <select
              className="filtro-select"
              value={especialidadSeleccionada}
              onChange={(e) => setEspecialidadSeleccionada(e.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="ninguna">Ninguna</option>
              {especialidades.map((especialidad) => (
                <option key={especialidad._id} value={especialidad._id}>
                  {especialidad.nombre}
                </option>
              ))}
            </select>
          </div>

          <label className="filtro-label">Filtrar por práctica</label>
          <div className="input-wrapper">
            <FaMicroscope className="search-icon" />
            <select
              className="filtro-select"
              value={practicaSeleccionada}
              onChange={(e) => setPracticaSeleccionada(e.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="ninguna">Ninguna</option>
              {practicas.map((practica) => (
                <option key={practica._id} value={practica._id}>
                  {practica.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div class="div-search-button">
          <Button
            variant="contained"
            id="search-button"
            startIcon={<FaSearch id="iconoBotonSearch" />}
            onClick={() => cargarServicios(1)}
          >
            <span className="text-buscador">Buscar</span>
          </Button>
        </div>
      </div>
      <div className="servicios-container">
        <div className="tabla-container">
          <table className="servicios-table">
            <thead>
              <tr>
                <th>Médico</th>
                <th>Sede</th>
                <th>Servicio</th>
                <th>Tipo</th>
                <th>Costo</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {servicios.map((servicio) => (
                <tr key={servicio._id}>
                  <td>{servicio.medico?.nombre}</td>

                  <td>{servicio.sede?.nombre}</td>

                  <td>{servicio.servicio?.nombre}</td>

                  <td>
                    <span className="tipo-badge">{textoEstado[servicio.servicio.tipo]}</span>
                  </td>

                  <td className="">${servicio.costo ?? 'Sin costo'}</td>

                  <td className="acciones">
                    <div>
                      <button className="menu-button" onClick={() => abrirMenu(servicio._id)}>
                        ⋮
                      </button>
                      {menuAbierto === servicio._id && (
                        <div className="acciones-menu">
                          <Link
                            to="/reserva-de-turnos"
                            state={{
                              nombreMedico: servicio.medico.nombre,
                              idServicio: servicio.servicio._id,
                              tipoServicio: servicio.servicio.tipo,
                              idSede: servicio.sede._id,
                            }}
                            className="btn-reservar"
                          >
                            <button>Reservar</button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="paginacion">
        <Paginacion
          paginaActual={paginaActual}
          totalDePaginas={totalPaginas}
          cambioDePagina={(page) => cargarServicios(page)}
        />
      </div>
    </Box>
  )
}

export default BusquedaServiciosPage
