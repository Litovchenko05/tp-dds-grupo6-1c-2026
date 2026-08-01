import './MedicoAgenda.css'
import { useMemo, useState } from 'react'
import { useUsuario } from '../../../context/UsuarioContext.jsx'
import useMedicoTurnos from '../hooks/useMedicoTurnos'
import useCancelarTurno from '../hooks/useCancelarTurno'
import useMarcarRealizadoTurno from '../hooks/useMarcarRealizadoTurno'
import useReactivarTurno from '../hooks/useReactivarTurno'
import useObtenerHistorialPaciente from '../hooks/useObtenerHistorialPaciente'
import CancelarTurnoModal from '../components/CancelarTurnoModal'
import Collapse from '@mui/material/Collapse'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import LoadingSpinner from '../../../components/common/LoadingSpinner'
import TurnGridSkeleton from '../../../components/common/TurnGridSkeleton'
import AgendaFiltros from './components/AgendaFiltros'
import AgendaTurnoCard from './components/AgendaTurnoCard'
import AgendaTurnosTable from './components/AgendaTurnosTable'

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
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false)
  const { usuario } = useUsuario()
  const { turnos: turnosBackend, pagination, loading: isLoading, error: turnosError, refetch } = useMedicoTurnos(usuario?._id)
  const { cancelar, loading: cancelando } = useCancelarTurno()
  const { marcarRealizado } = useMarcarRealizadoTurno()
  const { reactivar } = useReactivarTurno()
  const {
    historial: historialBackend,
    loading: isHistorialLoading,
    obtenerHistorial,
  } = useObtenerHistorialPaciente()
  const [hasError, setHasError] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showHistorialPanel, setShowHistorialPanel] = useState(false)
  const [turnoACancelar, setTurnoACancelar] = useState(null)

  const [turnoHistorialSeleccionado, setTurnoHistorialSeleccionado] = useState(null)
  const [agendaPage, setAgendaPage] = useState(1)
  const turnos = useMemo(
    () =>
      turnosBackend.map((turno) => {
        const fechaHora = new Date(turno.fechaHora)
        const horaInicio = fechaHora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
        const horaFin = new Date(fechaHora.getTime() + (turno.duracion || 0) * 60000).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
        return {
          ...turno,
          id: turno._id,
          paciente: turno.paciente?.usuario?.nombre || turno.paciente?.nombre || '',
          pacienteId: turno.paciente?._id || turno.paciente,
          servicio: turno.servicio?.nombre || 'Servicio no disponible',
          sede: turno.sede?.nombre || 'Sede no disponible',
          fecha: fechaHora.toLocaleDateString('en-CA'),
          hora: `${horaInicio} - ${horaFin}`,
        }
      }),
    [turnosBackend]
  )
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

  const handleAccionTurno = async (accion, turnoId) => {
    const turnoActual = turnos.find((turno) => turno.id === turnoId)
    if (!turnoActual) return

    setFeedbackMsg('')
    setErrorMsg('')

    if (accion === 'Cancelar') {
      if (!puedeCancelarTurno(turnoActual)) {
        setErrorMsg('No se puede cancelar el turno. Sólo se puede cancelar hasta una hora antes.')
        return
      }

      setTurnoACancelar(turnoActual)
      return
    }

    if (accion === 'Marcar realizado') {
      await marcarRealizado(usuario._id, turnoId)
      await refetch({ ...crearFiltrosBackend(filtrosAplicados), page: agendaPage, limit: 10 })
      setFeedbackMsg(`Turno ${turnoId} marcado como realizado.`)
      return
    }

    if (accion === 'Marcar como disponible') {
      try {
        await reactivar(usuario._id, turnoId)
        await refetch({ ...crearFiltrosBackend(filtrosAplicados), page: agendaPage, limit: 10 })
        setFeedbackMsg(`Turno ${turnoId} reactivado como disponible.`)
      } catch (error) {
        setErrorMsg(error.response?.data?.message || 'No se pudo reactivar el turno.')
      }
      return
    }

    if (accion === 'Ver historial del paciente') {
      if (!turnoActual.pacienteId) {
        setErrorMsg('El turno no tiene un paciente asociado.')
        return
      }
      setTurnoHistorialSeleccionado(turnoActual)
      setShowHistorialPanel(true)
      setHistorialPage(1)
      setFeedbackMsg('')
      try {
        await obtenerHistorial(usuario._id, turnoActual.pacienteId)
      } catch (error) {
        setErrorMsg(error.response?.data?.message || 'No se pudo cargar el historial del paciente.')
      }
    }
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



  const turnosFiltrados = turnos

  const agendaTotalPages = pagination?.totalPages || 1
  const agendaPageSafe = Math.min(agendaPage, agendaTotalPages)
  const turnosAgendaPaginados = turnosFiltrados

  const limpiarFiltros = async () => {
    setFiltrosDraft(filtrosIniciales)
    setFiltrosAplicados(filtrosIniciales)
    setAgendaPage(1)
    setHasError(false)
    setErrorMsg('')
    await refetch({ page: 1, limit: 10 })
  }

  const crearFiltrosBackend = (filtros) => {
    const filtrosBackend = {
      paciente: filtros.paciente?.trim() || undefined,
      estado: filtros.estado || undefined,
    }
    const hoy = new Date()
    const formatearFecha = (fecha) => fecha.toLocaleDateString('en-CA')

    if (filtros.tipoFecha === 'HOY') {
      filtrosBackend.fechaDesde = formatearFecha(hoy)
      filtrosBackend.fechaHasta = formatearFecha(hoy)
    }
    if (filtros.tipoFecha === 'SEMANA') {
      filtrosBackend.fechaDesde = formatearFecha(inicioSemana(hoy))
      filtrosBackend.fechaHasta = formatearFecha(finSemana(hoy))
    }
    if (filtros.tipoFecha === 'MES') {
      filtrosBackend.fechaDesde = formatearFecha(new Date(hoy.getFullYear(), hoy.getMonth(), 1))
      filtrosBackend.fechaHasta = formatearFecha(new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0))
    }
    if (filtros.tipoFecha === 'ESPECIFICA' && filtros.fecha) {
      filtrosBackend.fechaDesde = filtros.fecha
      filtrosBackend.fechaHasta = filtros.fecha
    }
    if (filtros.tipoFecha === 'RANGO') {
      filtrosBackend.fechaDesde = filtros.fechaDesde || undefined
      filtrosBackend.fechaHasta = filtros.fechaHasta || undefined
    }
    return filtrosBackend
  }

  const buscarTurnos = async () => {
    setHasError(false)
    setFiltrosAplicados(filtrosDraft)
    setAgendaPage(1)
    await refetch({ ...crearFiltrosBackend(filtrosDraft), page: 1, limit: 10 })
  }

  const confirmarCancelacion = async (motivo) => {
    if (!turnoACancelar) return
    try {
      await cancelar(usuario._id, turnoACancelar.id, motivo)
      await refetch({ ...crearFiltrosBackend(filtrosAplicados), page: agendaPage, limit: 10 })
      setFeedbackMsg(`Turno ${turnoACancelar.id} cancelado correctamente.`)
      setTurnoACancelar(null)
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'No se pudo cancelar el turno.')
      throw error
    }
  }

  const cerrarHistorialPanel = () => {
    setShowHistorialPanel(false)
    setTurnoHistorialSeleccionado(null)
  }

  const historialPaciente = useMemo(() => {
    if (!turnoHistorialSeleccionado) return []
    return historialBackend.map((turno) => ({
      id: turno._id || turno.id,
      servicio: turno.servicio?.nombre || turno.practica?.nombre || turno.especialidad?.nombre,
      medicoNombre: turno.medico?.nombre,
      medicoContacto: turno.medico?.usuario?.email,
      fecha: turno.fechaHora ? new Date(turno.fechaHora).toLocaleDateString('es-AR') : '',
    }))
  }, [historialBackend, turnoHistorialSeleccionado])

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
      <main
        className={`medico-agenda ${mostrarBusqueda ? 'medico-agenda--filters-open' : 'medico-agenda--filters-closed'}`}
      >
        <section className="medico-agenda__hero">
          <div className="medico-agenda__hero-heading">
            <div>
              <span className="medico-agenda__eyebrow">Panel profesional</span>
              <h1>Agenda médica</h1>
              <p className="medico-agenda__guide">
                Gestioná tus turnos aplicando filtros por paciente, fecha o estado.
              </p>
            </div>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setMostrarBusqueda((prev) => !prev)}
              className="agenda-filter-toggle"
            >
              {mostrarBusqueda ? 'Ocultar filtros' : 'Mostrar filtros'}
            </Button>
          </div>
          <Collapse in={mostrarBusqueda} timeout={300} unmountOnExit={false}>
            <section className="agenda-search-panel">
              <AgendaFiltros filtros={filtrosDraft} onChange={onChangeFiltro} />
              <div className="agenda-tools">
                <Button
                  variant="contained"
                  id="search-button"
                  startIcon={<SearchIcon />}
                  onClick={buscarTurnos}
                >
                  Buscar
                </Button>
                <Button variant="outlined" startIcon={<FilterListIcon />} onClick={limpiarFiltros}>
                  Limpiar filtros
                </Button>
              </div>
            </section>
          </Collapse>
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
        ) : hasError || turnosError ? (
          <div className="agenda-error" role="alert">
            <p>No se pudieron cargar los turnos.</p>
            <button type="button" onClick={() => refetch({ ...crearFiltrosBackend(filtrosAplicados), page: agendaPage, limit: 10 })}>
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
                  onClick={() => {
                    const page = Math.max(1, agendaPageSafe - 1)
                    setAgendaPage(page)
                    refetch({ ...crearFiltrosBackend(filtrosAplicados), page, limit: 10 })
                  }}
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
                  onClick={() => {
                    const page = Math.min(agendaTotalPages, agendaPageSafe + 1)
                    setAgendaPage(page)
                    refetch({ ...crearFiltrosBackend(filtrosAplicados), page, limit: 10 })
                  }}
                  disabled={agendaPageSafe >= agendaTotalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      <CancelarTurnoModal
        isOpen={Boolean(turnoACancelar)}
        loading={cancelando}
        onClose={() => setTurnoACancelar(null)}
        onConfirm={confirmarCancelacion}
      />
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
                  <LoadingSpinner size={34} color="primary" />
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
    </>
  )
}

export default MedicoAgenda
