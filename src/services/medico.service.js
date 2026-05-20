import { medicoRepository } from '../repositories/datosPrueba.enMemoria.js'
import { Medico } from '../models/Medico.js'    
import { DisponibilidadHoraria } from '../models/disponibilidadHoraria.js'

export class MedicoService {
    constructor({ medicoRepository, agendaService }) {
        this.medicoRepository = medicoRepository
        this.agendaService = agendaService
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

    agregarDisponibilidad(medicoId, disponibilidad){

        try{
            const medico = this.medicoRepository.obtenerPorId(Number(medicoId))
   
            if (!medico) {
                throw new Error('Médico no encontrado')
            }
            const nuevaDisponibilidad = new DisponibilidadHoraria(
                                        disponibilidad.diaSemana,
                                        disponibilidad.horaDesde,
                                        disponibilidad.horaHasta
                                        );
            medico.definirDisponibilidad(nuevaDisponibilidad);

            setImmediate(() => {
                 this.generarTurnosPorAnio(medico, nuevaDisponibilidad);
            });
            

        }catch(error){
            throw new Error('error en agregar disponibilidad para el médico');
        }
    }

   async generarTurnosPorAnio(medico, disponibilidad){

        try{
            this.agendaService.generarTurnosParaDisponibilidad(medico, disponibilidad);
        }catch(error){
             throw new Error('error al delegar la generación de turnos por disponibildad al serviceAgenda');
        }
        
    }

    modificarDisponibilidad(medicoId, disponibilidadId, nuevaDisponibilidad){
        try{
            const medico = this.medicoRepository.obtenerPorId(Number(medicoId))
   
            if (!medico) {
                throw new Error('Médico no encontrado')
            }

            if(disponibilidadId < 0 || disponibilidadId >= medico.disponibilidades.length){
                
                throw new Error('Disponibilidad no encontrada para el médico');
            }

            const disponibilidadAnterior = medico.disponibilidades[disponibilidadId];

            const disponibilidadNuevaObj = new DisponibilidadHoraria(
                nuevaDisponibilidad.diaSemana,
                nuevaDisponibilidad.horaDesde,
                nuevaDisponibilidad.horaHasta
            );
           
            console.log("Disponibilidad existente antes de la modificación: ", disponibilidadAnterior.diaSemana + " " + disponibilidadAnterior.horaDesde + " - " + disponibilidadAnterior.horaHasta);

            medico.modificarDisponibilidad(disponibilidadId, disponibilidadNuevaObj);

            console.log("Disponibilidad existente después de la modificación: ", medico.disponibilidades[disponibilidadId].diaSemana + " " + medico.disponibilidades[disponibilidadId].horaDesde + " - " + medico.disponibilidades[disponibilidadId].horaHasta);

            setImmediate(() => {
                 this.generarTurnosPorAnioParaDisponibilidadModificada(medico,disponibilidadAnterior ,disponibilidadNuevaObj);
            });
        }catch(error){
            throw new Error('Error en modificar disponibilidad para el médico');
        }   
    }

    generarTurnosPorAnioParaDisponibilidadModificada(medico, disponibilidadAnterior, disponibilidadModificada){
        this.agendaService.cambiarTurnosPorDisponibilidadModificada(medico, disponibilidadAnterior, disponibilidadModificada);
    }

}
