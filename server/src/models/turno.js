import { Agenda } from './Agenda.js'
import { EstadoTurno } from './EstadoTurno.enum.js'
export class Turno {
  id
  medico
  paciente
  fechaHora
  sede
  servicio
  estado
  historialEstados
  costo
  tipoDeServicio
  duracion

  constructor(medico, fechaHora, sede, servicio, tipoDeServicio, duracion) {
    this.medico = medico
    this.paciente = null // Inicialmente sin paciente asignado
    this.fechaHora = fechaHora //date
    this.sede = sede
    this.servicio = servicio //practica o especialidad asociado al turno
    this.estado = EstadoTurno.DISPONIBLE // Estado inicial
    this.historialEstados = []
    this.costo = null
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
    if (this.paciente.id === id_usuario) {
      return this.paciente
    }
    if (this.medico.id === id_usuario) {
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

  getId() {
    return this.id
  }

  getMedico() {
    return this.medico
  }

  getPaciente() {
    return this.paciente
  }

  getFechaHora() {
    return this.fechaHora
  }

  getSede() {
    return this.sede
  }

  getServicio() {
    return this.servicio
  }

  getEstado() {
    return this.estado
  }

  getHistorialEstados() {
    return this.historialEstados
  }

  getCosto() {
    return this.costo
  }

  getFechaTurno() {
    return this.fechaHora
  }

  getUltimoCambioEstado() {
    return this.historialEstados.at(-1)
  }

  getEstadoActual() {
    return this.estado
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
    return this.practica.nombre
  }
}
