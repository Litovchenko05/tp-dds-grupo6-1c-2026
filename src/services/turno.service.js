import { TurnoRepository } from '../repositories/turno.repository.js'

export class TurnoService {
    constructor({ turnoRepository }) {
        this.turnoRepository = turnoRepository
    }

    #mapToDto(t) {
        return {
            id: t.id,
            medico: t.medico ? {
                id: t.medico.id,
                nombre: t.medico.nombre,
                matricula: t.medico.matricula,
                usuario: t.medico.usuario
            } : null,
            paciente: t.paciente ? {
                id: t.paciente.id,
                nombre: t.paciente.nombre,
                dni: t.paciente.dni,
                usuario: t.paciente.usuario
            } : null,
            fechaHora: t.fechaHora,
            sede: t.sede ? {
                id: t.sede.id,
                nombre: t.sede.nombre,
                direccion: t.sede.direccion
            } : null,
            practica: t.practica ? {
                id: t.practica.id,
                codigo: t.practica.codigo,
                nombre: t.practica.nombre,
                duracionTurnoEnMins: t.practica.duracionTurnoEnMins,
                costo: t.practica.costo
            } : null,
            estado: t.estado,
            historialEstados: t.historialEstados,
            costo: t.costo
        }
    }

    obtenerTodos(){
        const turnos = this.turnoRepository.obtenerTodos()
        return turnos.map(this.#mapToDto)
    }

    obtenerPorId(id) {
        const turno = this.turnoRepository.obtenerPorId(Number(id))

        return turno ? this.#mapToDto(turno) : null
    }

}