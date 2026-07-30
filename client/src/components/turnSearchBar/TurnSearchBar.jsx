import './TurnSearchBar.css'
import Typography from '@mui/material/Typography'
import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { getEspecialidades, getPracticas } from '../../service/serviciosService.js'
import { getSedes } from '../../service/sedesService.js'

import {
  FaStethoscope,
  FaSearch,
  FaHospital,
  FaUserMd,
  FaMicroscope,
  FaNotesMedical,
  FaTimes,
} from 'react-icons/fa'

const TurnSearchBar = ({ onBuscar }) => {
  const [tipoServicio, setTipoServicio] = useState('')
  const [especialidades, setEspecialidades] = useState([])
  const [practicas, setPracticas] = useState([])
  const [sedes, setSedes] = useState([])

  const [nombreMedico, setNombreMedico] = useState('')
  const [idServicio, setIdServicio] = useState('')
  const [idSede, setIdSede] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  useEffect(() => {
    const cargarDatos = async () => {
      const [especialidades, practicas, sedes] = await Promise.all([
        getEspecialidades(),
        getPracticas(),
        getSedes(),
      ])

      setEspecialidades(especialidades.data)
      setPracticas(practicas.data)
      setSedes(sedes.data)
    }

    cargarDatos()
  }, [])

  const buscarTurnos = () => {
    onBuscar({
      nombreMedico,
      idServicio,
      idSede,
      fechaDesde,
      fechaHasta,
      tipoServicio,
    })
  }

  const limpiarFiltros = () => {
    setNombreMedico('')
    setTipoServicio('')
    setIdServicio('')
    setIdSede('')
    setFechaDesde('')
    setFechaHasta('')
    onBuscar(null)
  }
  return (
    <div className="turn-search" id="buscador-turnos">
      <Typography variant="h4" className="page-title">
        Búsqueda de turnos
      </Typography>
      <p>Encontrá y reservá turnos médicos en segundos.</p>
      <div className="filters-grid">
        <div className="input-wrapper">
          <FaUserMd className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Busca por profesional"
            value={nombreMedico}
            onChange={(e) => setNombreMedico(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <FaNotesMedical className="search-icon" />
          <select
            className="search-input"
            defaultValue=""
            value={tipoServicio}
            onChange={(e) => {
              setTipoServicio(e.target.value)
              setIdServicio('')
            }}
          >
            <option value="" disabled hidden>
              Tipo de servicio
            </option>
            <option value="especialidad">Especialidad</option>
            <option value="practica">Práctica</option>
          </select>
        </div>

        {tipoServicio === 'especialidad' && (
          <div className="input-wrapper">
            <FaStethoscope className="search-icon" />
            <select
              className="search-input"
              defaultValue=""
              value={idServicio}
              onChange={(e) => setIdServicio(e.target.value)}
            >
              <option value="" disabled hidden>
                Especialidad
              </option>
              {especialidades.map((especialidad) => (
                <option key={especialidad._id} value={especialidad._id}>
                  {especialidad.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {tipoServicio === 'practica' && (
          <div className="input-wrapper">
            <FaMicroscope className="search-icon" />
            <select
              className="search-input"
              defaultValue=""
              value={idServicio}
              onChange={(e) => setIdServicio(e.target.value)}
            >
              <option value="" disabled hidden>
                Práctica
              </option>
              {practicas.map((practica) => (
                <option key={practica._id} value={practica._id}>
                  {practica.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="input-wrapper">
          <FaHospital className="search-icon" />
          <select
            className="search-input"
            defaultValue=""
            value={idSede}
            onChange={(e) => setIdSede(e.target.value)}
          >
            <option value="" disabled hidden>
              Sede
            </option>
            {sedes.map((sede) => (
              <option key={sede._id} value={sede._id}>
                {sede.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="input-wrapper">
          <label>Desde</label>
          <input
            type="date"
            className="search-input"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <label>Hasta</label>
          <input
            type="date"
            className="search-input"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>

        <div class="div-search-button">
          <Button
            variant="contained"
            id="search-button"
            startIcon={<FaSearch id="iconoBotonSearch" />}
            onClick={buscarTurnos}
          >
            <span className="text-buscador">Buscar</span>
          </Button>
        </div>

        <Button
          variant="outlined"
          id="clear-filters-button"
          startIcon={<FaTimes />}
          onClick={limpiarFiltros}
        >
          <div className="text-buscador">
            <span>Limpiar filtros</span>
          </div>
        </Button>
      </div>
    </div>
  )
}

export default TurnSearchBar
