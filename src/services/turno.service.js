import { TurnoRepository } from './repositories/turno.repository.js'
import { Turno } from './models/turno.js'
import { EstadoTurno } from '../models/estadoTurno.enum.js'

export class TurnoService {
  constructor({ turnoRepository }) {
    this.turnoRepository = turnoRepository
  }

  #mapToDto(t) {
    return {
      id: t.id,
      medico: t.medico
        ? {
            id: t.medico.id,
            nombre: t.medico.nombre,
            matricula: t.medico.matricula,
            usuario: t.medico.usuario,
          }
        : null,
      paciente: t.paciente
        ? {
            id: t.paciente.id,
            nombre: t.paciente.nombre,
            dni: t.paciente.dni,
            usuario: t.paciente.usuario,
          }
        : null,
      fechaHora: t.fechaHora,
      sede: t.sede
        ? {
            id: t.sede.id,
            nombre: t.sede.nombre,
            direccion: t.sede.direccion,
          }
        : null,
      practica: t.practica
        ? {
            id: t.practica.id,
            codigo: t.practica.codigo,
            nombre: t.practica.nombre,
            duracionTurnoEnMins: t.practica.duracionTurnoEnMins,
            costo: t.practica.costo,
          }
        : null,
      estado: t.estado,
      historialEstados: t.historialEstados,
      costo: t.costo,
    }
  }

  obtenerTodos() {
    const turnos = this.turnoRepository.obtenerTodos()
    return turnos.map(this.#mapToDto)
  }

  obtenerPorId(id) {
    const turno = this.turnoRepository.obtenerPorId(Number(id))
  }

  cancelar(id_turno, id_usuario, motivo){
    const turno = this.turnoRepository.obtenerPorId(Number(turnoId))
    if (!turno) {
      throw new Error('Turno no encontrado')
    }
    if (turno.estado === 'cancelado') {
      throw new Error('El turno ya está cancelado')
    }

    const unaHoraEnMs = 60 * 60 * 1000
    const tiempoRestante = new Date(turno.fechaHora).getTime() - Date.now()

    if (tiempoRestante < unaHoraEnMs) {
      throw new Error('Debe cancelar con al menos 1 hora de anticipación')
    }

    const cancelador = turno.quienModifica(id_usuario)

    if(!cancelador){
      throw new Error('No tiene permiso para cancelar este turno.')
    }

    turno.actualizarEstado(EstadoTurno.CANCELADO,cancelador,motivo)

    this.turnoRepository.guardar(turno)

    return this.#mapToDto(turno)
  }

  marcarComoRealizado(id_turno, id_usuario){
    if (turno.estado === 'realizado') {
      return this.#mapToDto(turno)
    }
    const turno = this.turnoRepository.obtenerPorId(id_turno)
    if (!turno) {
      throw new Error('Turno no encontrado')
    }
    
    if(turno.medico.id !== id_usuario){
      throw new Error('Solo el médico puede marcar el turno como realizado')
    }
    
    if (turno.estado !== 'confirmado') {
      throw new Error('Solo se puede marcar como realizado un turno confirmado')
    }

    turno.actualizarEstado(EstadoTurno.REALIZADO, turno.medico, 'El turno ha sido realizado')
    this.turnoRepository.guardar(turno)
    return this.#mapToDto(turno)
  }
}
