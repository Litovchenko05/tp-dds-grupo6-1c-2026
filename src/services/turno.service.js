import { TurnoRepository } from './repositories/turno.repository.js'
import { Turno } from './models/turno.js'

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
            const quienCancela ={
                if (turno.paciente.id === id_usuario) return turno.paciente
                if (turno.medico.id === id_usuario) return turno.medico
                }
            if(!quienCancela){
                 throw new Error('No tiene permiso para cancelar este turno.')
            }

            turno.actualizarEstado('cancelado',quienCancela,motivo)

            // 7. Guardar cambios en el repository
            this.turnoRepository.guardar(turno)

            // 8. Mapear a DTO y retornar
            return this.#mapToDto(turno)
        }
    }

}
    return turno ? this.#mapToDto(turno) : null
  }
}
