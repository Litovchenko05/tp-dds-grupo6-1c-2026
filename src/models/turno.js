//import { turnoSchema } from '../schemas/turno.schema.js'
import { Agenda } from './agenda.js'
import { FactoryNotificacion } from './notificacion.factory.js'
import { EstadoTurno } from './estadoTurno.enum.js'
export class Turno {
  #id
  #medico
  #paciente
  #fechaHora
  #sede
  #practica
  #estado
  #historialEstados
  #costo

  constructor(idTurno, medico, fechaHora, sede, practica) {
    this.#id = idTurno
    this.#medico = medico
    this.#paciente = null // Inicialmente sin paciente asignado
    this.#fechaHora = fechaHora //date
    this.#sede = sede
    this.#practica = practica //practica o servicio asociado al turno
    this.#estado = EstadoTurno.DISPONIBLE // Estado inicial
    this.#historialEstados = []
    this.#costo = null
  }

  actualizarEstado(nuevoEstado, quien, motivo) {
    this.#estado = nuevoEstado

    this.#historialEstados.push({
      fechaHoraIngreso: new Date(),
      estado: nuevoEstado,
      turno: this,
      usuario: quien,
      motivo: motivo,
    })
  }

  get id() {
    return this.#id
  }

  get medico() {
    return this.#medico
  }

  get paciente() {
    return this.#paciente
  }

  get fechaHora() {
    return this.#fechaHora
  }

  get sede() {
    return this.#sede
  }

  get practica() {
    return this.#practica
  }

  get estado() {
    return this.#estado
  }

  get historialEstados() {
    return this.#historialEstados
  }

  get costo() {
    return this.#costo
  }

  get fechaTurno() {
    return this.fechaHora
  }

  get ultimoCambioEstado() {
    return this.historialEstados.at(-1)
  }

  get estadoActual() {
    return this.estado
  }

  reservar(paciente) {
    this.#paciente = paciente
    this.actualizarEstado(
      EstadoTurno.RESERVADO,
      paciente.usuario,
      'El paciente ha reservado el turno'
    )
  }

  cambiarFechaHora(nuevaFechaHora) {
    this.#fechaHora = nuevaFechaHora
  }

  esManiana() {
    // 'YYYY-MM-DD'
    if (Agenda.buscarTurnoParaGenerarNotificacionesDeRecordatorio(this)) {
      this.recordarTurno = true
      return true
    }
  }

  toJSON() {
    return {
      id: this.#id,
      medico: {
        id: this.#medico.id,
        nombre: this.#medico.nombre,
      },
      paciente: this.#paciente
        ? {
            id: this.#paciente.id,
            nombre: this.#paciente.nombre,
          }
        : null,
      fechaHora: this.#fechaHora,
      estado: this.#estado,
      costo: this.#costo,
    }
  }
}
