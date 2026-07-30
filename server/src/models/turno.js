import { Agenda } from './Agenda.js'
import { EstadoTurno } from './EstadoTurno.enum.js'
export class Turno {
  id
  medico
  paciente
  fechaHora
  sede
  practica
  especialidad
  estado
  historialEstados
  costo
  tipoDeServicio
  duracion

  constructor(medico, fechaHora, sede, servicio, tipoDeServicio, duracion, costo) {
    this.medico = medico
    this.paciente = null // Inicialmente sin paciente asignado
    this.fechaHora = fechaHora //date
    this.sede = sede
    this.practica = servicio.practica ?? null
    this.especialidad = servicio.especialidad ?? null
    this.estado = EstadoTurno.DISPONIBLE // Estado inicial
    this.historialEstados = []
    this.costo = costo
    this.tipoDeServicio = tipoDeServicio
    this.duracion = duracion
  }

  actualizarEstado(nuevoEstado, quien, motivo) {
    this.estado = nuevoEstado

    this.historialEstados.push({
      fechaHoraIngreso: new Date(),
      estado: nuevoEstado,
      turno: this,
      usuario: quien,
      motivo: motivo,
    })
  }

  quienModifica(id_usuario) {
    if (this.paciente._id === id_usuario) {
      return this.paciente
    }
    if (this.medico._id === id_usuario) {
      return this.medico
    }
    return null
  }

  getContraparte(id_usuario) {
    if (this.paciente.id === id_usuario) {
      return this.medico
    }
    if (this.medico.id === id_usuario) {
      return this.paciente
    }
    return null
  }

  getUltimoCambioEstado() {
    return this.historialEstados.at(-1)
  }

  reservar(paciente) {
    this.paciente = paciente
    this.actualizarEstado(
      EstadoTurno.RESERVADO,
      paciente.usuario,
      'El paciente ha reservado el turno'
    )
  }

  cambiarFechaHora(nuevaFechaHora) {
    this.fechaHora = nuevaFechaHora
  }

  esManiana() {
    // 'YYYY-MM-DD'
    if (Agenda.buscarTurnoParaGenerarNotificacionesDeRecordatorio(this)) {
      this.recordarTurno = true
      return true
    }
  }

  getNombreServicio() {
    return this.practica?.nombre ?? this.especialidad?.nombre ?? ''
  }

  costoFinal() {
    const plan = this.paciente.plan
    const cobertura = this.obtenerNivelCobertura(this, plan)

    if (cobertura == null) {
      return this.costo
    }

    return this.costo - (this.costo * cobertura) / 100
  }

  obtenerNivelCobertura(turno, plan) {
    if (this.practica) {
      return plan.obtenerCoberturaPractica(this.practica)
    }

    if (this.especialidad) {
      return plan.obtenerCoberturaEspecialidad(this.especialidad)
    }

    return null
  }
}
