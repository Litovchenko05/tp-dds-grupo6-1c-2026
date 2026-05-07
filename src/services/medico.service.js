import { medicoRepository } from '../repositories/datosPrueba.enMemoria.js'

export class MedicoService {
    constructor({ medicoRepository }) {
        this.medicoRepository = medicoRepository
    }

    #mapToDto(m) {
        return {
            id: m.id,
            usuario: m.usuario,
            matricula: m.matricula,
            nombre: m.nombre,
            especialidades: Array.isArray(m.especialidades) ? m.especialidades.map(e => ({
                id: e.id,
                nombre: e.nombre,
                duracionTurnoEnMins: e.duracionTurnoEnMins,
                costo: e.costo
            })) : [],
            practicas: Array.isArray(m.practicas) ? m.practicas.map(p => ({
                id: p.id,
                codigo: p.codigo,
                nombre: p.nombre,
                duracionTurnoEnMins: p.duracionTurnoEnMins,
                costo: p.costo
            })) : [],
            sedes: Array.isArray(m.sedes) ? m.sedes.map(s => ({
                id: s.id,
                nombre: s.nombre,
                direccion: s.direccion
            })) : []
        }
    }

    obtenerTodos() {
        const medicos = this.medicoRepository.obtenerTodos()

        return medicos.map(this.#mapToDto)
    }

    obtenerPorId(id) {
        const medico = this.medicoRepository.obtenerPorId(Number(id))

        return medico ? this.#mapToDto(medico) : null
    }
}
