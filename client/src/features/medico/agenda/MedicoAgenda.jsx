import { useMemo, useState } from 'react'
import AgendaFiltros from './components/AgendaFiltros'
import AgendaTurnoCard from './components/AgendaTurnoCard'
import AgendaTurnosTable from './components/AgendaTurnosTable'
import turnosAgendaMock from './mock/turnosAgendaMock'
import './MedicoAgenda.css'

const MedicoAgenda = () => {
  const [filtros, setFiltros] = useState({
    paciente: '',
    fecha: '',
    estado: '',
  })
  const [turnos, setTurnos] = useState(turnosAgendaMock)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const onChangeFiltro = (event) => {
    const { name, value } = event.target
    setFiltros((prev) => ({ ...prev, [name]: value }))
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

    if (accion === 'Ver perfil del paciente') {
      setFeedbackMsg(`Abriendo perfil del paciente del turno ${turnoId}.`)
    }
  }

  const turnosFiltrados = useMemo(() => {
    return turnos.filter((turno) => {
      const nombrePaciente = turno.paciente || ''
      const coincidePaciente =
        !filtros.paciente || nombrePaciente.toLowerCase().includes(filtros.paciente.toLowerCase())

      const coincideFecha = !filtros.fecha || turno.fecha === filtros.fecha
      const coincideEstado = !filtros.estado || turno.estado === filtros.estado

      return coincidePaciente && coincideFecha && coincideEstado
    })
  }, [filtros, turnos])

  const limpiarFiltros = () => {
    setFiltros({ paciente: '', fecha: '', estado: '' })
    setHasError(false)
    setErrorMsg('')
  }

  const simularCarga = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 700)
  }

  const simularError = () => {
    setHasError(true)
  }

  return (
    <main className="medico-agenda">
      <section className="medico-agenda__hero">
        <h1>AGENDA MEDICA</h1>
        <p className="medico-agenda__guide">
          Gestioná tus turnos aplicando filtros por paciente, fecha o estado.
        </p>
      </section>

      <AgendaFiltros filtros={filtros} onChange={onChangeFiltro} />

      <div className="agenda-tools">
        <button type="button" onClick={limpiarFiltros}>
          Limpiar filtros
        </button>
        <button type="button" onClick={simularCarga}>
          Simular carga
        </button>
        <button type="button" onClick={simularError}>
          Simular error
        </button>
      </div>

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
        <p className="agenda-loading" role="status" aria-live="polite">
          Cargando turnos...
        </p>
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
            <AgendaTurnosTable turnos={turnosFiltrados} />
          </section>

          <section className="agenda-mobile">
            {turnosFiltrados.length ? (
              turnosFiltrados.map((turno) => (
                <AgendaTurnoCard key={turno.id} turno={turno} onAction={handleAccionTurno} />
              ))
            ) : (
              <p className="agenda-empty">
                No hay turnos para los filtros seleccionados. Probá con otros criterios o limpiá los
                filtros.
              </p>
            )}
          </section>
        </>
      )}
    </main>
  )
}

export default MedicoAgenda
