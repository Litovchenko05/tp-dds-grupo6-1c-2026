import { useMemo, useState } from 'react'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import TurnGridSkeleton from '../../../components/common/TurnGridSkeleton'
import MedicoFooter from '../../../components/Footer/MedicoFooter'
import AgendaFiltros from './components/AgendaFiltros'
import AgendaTurnoCard from './components/AgendaTurnoCard'
import AgendaTurnosTable from './components/AgendaTurnosTable'
import turnosAgendaMock from './mock/turnosAgendaMock'
import './MedicoAgenda.css'

const MedicoAgenda = () => {
  const filtrosIniciales = {
    paciente: '',
    tipoFecha: '',
    fecha: '',
    fechaDesde: '',
    fechaHasta: '',
    estado: '',
  }

  const [filtrosDraft, setFiltrosDraft] = useState(filtrosIniciales)
  const [filtrosAplicados, setFiltrosAplicados] = useState(filtrosIniciales)
  const [mostrarBusqueda, setMostrarBusqueda] = useState(true)
  const [turnos, setTurnos] = useState(turnosAgendaMock)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showHistorialPanel, setShowHistorialPanel] = useState(false)
  const [isHistorialLoading, setIsHistorialLoading] = useState(false)
  const [turnoHistorialSeleccionado, setTurnoHistorialSeleccionado] = useState(null)
  const [agendaPage, setAgendaPage] = useState(1)
  const [historialPage, setHistorialPage] = useState(1)

  const onChangeFiltro = (event) => {
    const { name, value } = event.target

    if (name === 'tipoFecha') {
      setFiltrosDraft((prev) => ({
        ...prev,
        tipoFecha: value,
        fecha: '',
        fechaDesde: '',
        fechaHasta: '',
      }))
      return
    }

    setFiltrosDraft((prev) => ({ ...prev, [name]: value }))
  }

  const getFechaHoraInicioTurno = (turno) => {
    const [anio, mes, dia] = turno.fecha.split('-').map(Number)
    const horaInicio = (turno.hora || '').split('-')[0]?.trim() || '00:00'
    const [horas, minutos] = horaInicio.split(':').map(Number)
    return new Date(anio, mes - 1, dia, horas || 0, minutos || 0, 0, 0)
  }

  const puedeCancelarTurno = (turno) => {
    const ahora = new Date()
    const inicioTurno = getFechaHoraInicioTurno(turno)
    const diferenciaMs = inicioTurno.getTime() - ahora.getTime()
    const unaHoraMs = 60 * 60 * 1000
    return diferenciaMs >= unaHoraMs
  }

  const handleAccionTurno = (accion, turnoId) => {
    const turnoActual = turnos.find((turno) => turno.id === turnoId)
    if (!turnoActual) return

    setFeedbackMsg('')
    setErrorMsg('')

    if (accion === 'Cancelar') {
      if (!puedeCancelarTurno(turnoActual)) {
        setErrorMsg('No se puede cancelar el turno. Sólo se puede cancelar hasta una hora antes.')
        return
      }

      setTurnos((prev) =>
        prev.map((turno) => (turno.id === turnoId ? { ...turno, estado: 'CANCELADO' } : turno))
      )
      setFeedbackMsg(`Turno ${turnoId} cancelado correctamente.`)
      return
    }

    if (accion === 'Marcar realizado') {
      setTurnos((prev) =>
        prev.map((turno) => (turno.id === turnoId ? { ...turno, estado: 'REALIZADO' } : turno))
      )
      setFeedbackMsg(`Turno ${turnoId} marcado como realizado.`)
      return
    }

    if (accion === 'Marcar como disponible') {
      setTurnos((prev) =>
        prev.map((turno) => (turno.id === turnoId ? { ...turno, estado: 'DISPONIBLE' } : turno))
      )
      setFeedbackMsg(`Turno ${turnoId} marcado como disponible.`)
      return
    }

    if (accion === 'Ver historial del paciente') {
      setTurnoHistorialSeleccionado(turnoActual)
      setShowHistorialPanel(true)
      setIsHistorialLoading(true)
      setHistorialPage(1)
      setFeedbackMsg('')

      setTimeout(() => {
        setIsHistorialLoading(false)
      }, 700)
    }
  }

  const parseFecha = (fechaStr) => {
    const [anio, mes, dia] = fechaStr.split('-').map(Number)
    return new Date(anio, mes - 1, dia, 0, 0, 0, 0)
  }

  const inicioSemana = (fecha) => {
    const copia = new Date(fecha)
    const dia = copia.getDay()
    const ajuste = dia === 0 ? -6 : 1 - dia
    copia.setDate(copia.getDate() + ajuste)
    copia.setHours(0, 0, 0, 0)
    return copia
  }

  const finSemana = (fecha) => {
    const inicio = inicioSemana(fecha)
    const fin = new Date(inicio)
    fin.setDate(inicio.getDate() + 6)
    fin.setHours(23, 59, 59, 999)
    return fin
  }

  const coincideConFiltroFecha = (fechaTurnoStr) => {
    if (!filtrosAplicados.tipoFecha) return true

    const hoy = new Date()
    const fechaTurno = parseFecha(fechaTurnoStr)

    if (filtrosAplicados.tipoFecha === 'HOY') {
      return fechaTurno.toDateString() === hoy.toDateString()
    }

    if (filtrosAplicados.tipoFecha === 'SEMANA') {
      const inicio = inicioSemana(hoy)
      const fin = finSemana(hoy)
      return fechaTurno >= inicio && fechaTurno <= fin
    }

    if (filtrosAplicados.tipoFecha === 'MES') {
      return (
        fechaTurno.getMonth() === hoy.getMonth() && fechaTurno.getFullYear() === hoy.getFullYear()
      )
    }

    if (filtrosAplicados.tipoFecha === 'ESPECIFICA') {
      if (!filtrosAplicados.fecha) return true
      return fechaTurnoStr === filtrosAplicados.fecha
    }

    if (filtrosAplicados.tipoFecha === 'RANGO') {
      if (!filtrosAplicados.fechaDesde && !filtrosAplicados.fechaHasta) return true
      const desde = filtrosAplicados.fechaDesde ? parseFecha(filtrosAplicados.fechaDesde) : null
      const hasta = filtrosAplicados.fechaHasta ? parseFecha(filtrosAplicados.fechaHasta) : null

      if (desde && fechaTurno < desde) return false
      if (hasta && fechaTurno > hasta) return false
      return true
    }

    return true
  }

  const turnosFiltrados = useMemo(() => {
    return turnos.filter((turno) => {
      const nombrePaciente = turno.paciente || ''
      const coincidePaciente =
        !filtrosAplicados.paciente ||
        nombrePaciente.toLowerCase().includes(filtrosAplicados.paciente.toLowerCase())

      const coincideFecha = coincideConFiltroFecha(turno.fecha)
      const coincideEstado = !filtrosAplicados.estado || turno.estado === filtrosAplicados.estado

      return coincidePaciente && coincideFecha && coincideEstado
    })
  }, [filtrosAplicados, turnos])

  const agendaRowsPerPage = 4
  const agendaTotalPages = Math.max(1, Math.ceil(turnosFiltrados.length / agendaRowsPerPage))
  const agendaPageSafe = Math.min(agendaPage, agendaTotalPages)
  const agendaStartIndex = (agendaPageSafe - 1) * agendaRowsPerPage
  const turnosAgendaPaginados = turnosFiltrados.slice(
    agendaStartIndex,
    agendaStartIndex + agendaRowsPerPage
  )

  const limpiarFiltros = () => {
    setFiltrosDraft(filtrosIniciales)
    setFiltrosAplicados(filtrosIniciales)
    setAgendaPage(1)
    setHasError(false)
    setErrorMsg('')
  }

  const buscarTurnos = () => {
    setHasError(false)
    setIsLoading(true)
    setTimeout(() => {
      setFiltrosAplicados(filtrosDraft)
      setAgendaPage(1)
      setIsLoading(false)
    }, 700)
  }

  const simularError = () => {
    setHasError(true)
  }

  const cerrarHistorialPanel = () => {
    setShowHistorialPanel(false)
    setIsHistorialLoading(false)
    setTurnoHistorialSeleccionado(null)
  }

  const historialPaciente = useMemo(() => {
    if (!turnoHistorialSeleccionado) return []

    return turnos.filter(
      (turno) =>
        turno.paciente === turnoHistorialSeleccionado.paciente &&
        turno.id !== turnoHistorialSeleccionado.id
    )
  }, [turnos, turnoHistorialSeleccionado])

  const historialRowsPerPage = 3
  const historialTotalPages = Math.max(
    1,
    Math.ceil(historialPaciente.length / historialRowsPerPage)
  )
  const historialPageSafe = Math.min(historialPage, historialTotalPages)
  const historialStartIndex = (historialPageSafe - 1) * historialRowsPerPage
  const historialPacientePaginado = historialPaciente.slice(
    historialStartIndex,
    historialStartIndex + historialRowsPerPage
  )

  return (
    <>
      <main className="medico-agenda">
        <section className="medico-agenda__top-panel">
          <section className="medico-agenda__hero">
            <h1>AGENDA MÉDICA</h1>
            <p className="medico-agenda__guide">
              Gestioná tus turnos aplicando filtros por paciente, fecha o estado.
            </p>
          </section>

          <Collapse in={mostrarBusqueda} timeout={300} unmountOnExit={false}>
            <section className="agenda-search-panel">
              <AgendaFiltros filtros={filtrosDraft} onChange={onChangeFiltro} />

              <div className="agenda-tools">
                <button type="button" className="agenda-tools__buscar" onClick={buscarTurnos}>
                  Buscar
                </button>
                <button type="button" onClick={limpiarFiltros}>
                  Limpiar filtros
                </button>
                <button type="button" onClick={simularError}>
                  Simular error
                </button>
              </div>
            </section>
          </Collapse>

          <div className="agenda-collapse-toggle">
            <IconButton
              type="button"
              className="agenda-toggle-search"
              onClick={() => setMostrarBusqueda((prev) => !prev)}
              aria-label={mostrarBusqueda ? 'Ocultar búsqueda' : 'Mostrar búsqueda'}
            >
              {mostrarBusqueda ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </div>
        </section>

        {feedbackMsg && (
          <div className="agenda-feedback" role="status" aria-live="polite">
            {feedbackMsg}
          </div>
        )}

        {errorMsg && (
          <div className="agenda-feedback agenda-feedback--error" role="alert">
            {errorMsg}
          </div>
        )}

        {isLoading ? (
          <section
            className="agenda-loading"
            role="status"
            aria-live="polite"
            aria-label="Cargando turnos"
          >
            <div className="agenda-skeleton-desktop">
              <TurnGridSkeleton items={6} />
            </div>
            <div className="agenda-skeleton-mobile">
              <TurnGridSkeleton items={3} />
            </div>
          </section>
        ) : hasError ? (
          <div className="agenda-error" role="alert">
            <p>No se pudieron cargar los turnos.</p>
            <button type="button" onClick={() => setHasError(false)}>
              Reintentar
            </button>
          </div>
        ) : (
          <>
            <section className="agenda-desktop">
              <AgendaTurnosTable turnos={turnosAgendaPaginados} onAction={handleAccionTurno} />
            </section>

            <section className="agenda-mobile">
              {turnosAgendaPaginados.length ? (
                turnosAgendaPaginados.map((turno) => (
                  <AgendaTurnoCard key={turno.id} turno={turno} onAction={handleAccionTurno} />
                ))
              ) : (
                <p className="agenda-empty">
                  No hay turnos para los filtros seleccionados. Probá con otros criterios o limpiá
                  los filtros.
                </p>
              )}
            </section>

            {turnosFiltrados.length > 0 && (
              <div className="agenda-pagination">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setAgendaPage((prev) => Math.max(1, prev - 1))}
                  disabled={agendaPageSafe <= 1}
                >
                  Anterior
                </Button>
                <span>
                  Página {agendaPageSafe} de {agendaTotalPages}
                </span>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setAgendaPage((prev) => Math.min(agendaTotalPages, prev + 1))}
                  disabled={agendaPageSafe >= agendaTotalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      {showHistorialPanel && (
        <section className="paciente-historial-overlay" role="dialog" aria-modal="true">
          <article className="paciente-historial-panel">
            <header className="paciente-historial-panel__header">
              <div>
                <h2>Historial del paciente</h2>
                <p>{turnoHistorialSeleccionado?.paciente || 'Paciente'}</p>
              </div>
              <button
                type="button"
                className="paciente-historial-panel__close"
                aria-label="Cerrar historial del paciente"
                onClick={cerrarHistorialPanel}
              >
                ×
              </button>
            </header>

            <div className="paciente-historial-panel__content">
              {isHistorialLoading ? (
                <div className="paciente-historial-loading" role="status" aria-live="polite">
                  <CircularProgress size={34} thickness={4.5} />
                  <p>Cargando historial del paciente...</p>
                </div>
              ) : historialPaciente.length ? (
                historialPacientePaginado.map((turno) => (
                  <article key={`historial-${turno.id}`} className="paciente-historial-card">
                    <p>
                      <strong>Tipo de servicio:</strong> {turno.servicio || 'No disponible'}
                    </p>
                    <p>
                      <strong>Médico tratante:</strong> {turno.medicoNombre || 'No disponible'}
                    </p>
                    <p>
                      <strong>Contacto del médico:</strong>{' '}
                      {turno.medicoContacto || 'No disponible'}
                    </p>
                    <p>
                      <strong>Fecha de atención:</strong> {turno.fecha || 'No disponible'}
                    </p>
                  </article>
                ))
              ) : (
                <p className="paciente-historial-panel__empty">
                  No hay turnos previos registrados para este paciente.
                </p>
              )}
            </div>

            {!isHistorialLoading && historialPaciente.length > 0 && (
              <div className="paciente-historial-pagination">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setHistorialPage((prev) => Math.max(1, prev - 1))}
                  disabled={historialPageSafe <= 1}
                >
                  Anterior
                </Button>
                <span>
                  Página {historialPageSafe} de {historialTotalPages}
                </span>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    setHistorialPage((prev) => Math.min(historialTotalPages, prev + 1))
                  }
                  disabled={historialPageSafe >= historialTotalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </article>
        </section>
      )}

      <MedicoFooter />
    </>
  )
}

export default MedicoAgenda
