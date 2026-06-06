//import { turnoSchema } from '../schemas/turno.schema.js'
import { Agenda } from './Agenda.js'
import { FactoryNotificacion } from './Notificacion.factory.js'
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

  constructor(medico, fechaHora, sede, servicio, tipoDeServicio) {
    this.medico = medico
    this.paciente = null // Inicialmente sin paciente asignado
    this.fechaHora = fechaHora //date
    this.sede = sede
    this.servicio = servicio //practica o especialidad asociado al turno
    this.estado = EstadoTurno.DISPONIBLE // Estado inicial
    this.historialEstados = []
    this.costo = null
    this.tipoDeServicio = tipoDeServicio
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

  // toJSON() {
  //   return {
  //     id: this.#id,
  //     medico: {
  //       id: this.#medico.id,
  //       nombre: this.#medico.nombre,
  //     },
  //     paciente: this.#paciente
  //       ? {
  //           id: this.#paciente.id,
  //           nombre: this.#paciente.nombre,
  //         }
  //       : null,
  //     fechaHora: this.#fechaHora,
  //     estado: this.#estado,
  //     costo: this.#costo,
  //   }
  // }
}
