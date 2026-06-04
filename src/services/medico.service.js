import { MedicoRepository } from '../repositories/medico.repository.js'
import {EspecialidadRepository} from '../repositories/especialidad.repository.js'
import { PracticaRepository } from '../repositories/practica.repository.js'
import { SedeRepository } from '../repositories/sede.repository.js'
import { Medico } from '../models/Medico.js'
import { DisponibilidadHoraria } from '../models/disponibilidadHoraria.js'
import { Especialidad } from '../models/Especialidad.js'
import { Practica } from '../models/Practica.js'
import { Sede } from '../models/Sede.js'

export class MedicoService {
  constructor({ medicoRepository, agendaService, especialidadRepository, practicaRepository,sedeRepository }) {
    this.medicoRepository = new medicoRepository()
    this.agendaService = agendaService
    this.especialidadRepository = especialidadRepository
    this.practicaRepository = practicaRepository
    this.sedeRepository = sedeRepository
  }


  async createMedico(medicoData){
      if (!medicoData.usuario || !medicoData.matricula || !medicoData.nombre || !medicoData.especialidades || !medicoData.practicas || !medicoData.sedes || !medicoData.disponibilidades) {
          throw new ValidationError('Todos los campos son requeridos');
      }

      const existente = await this.medicoRepository.findByNombre(medicoData.nombre); 
        if (existente) {
          throw new Error ('El médico ya existe');
        }
      
      const especialidadesIds = await this.obtenerIdsEspecialidades(medicoData.especialidades);
      const practicasIds = await this.obtenerIdsPracticas(medicoData.practicas);
      const sedesIds = await this.obtenerIdsSedes(medicoData.sedes);

      const nuevoMedico = new Medico(medicoData.usuario,medicoData.matricula, medicoData.nombre, especialidadesIds, practicasIds, sedesIds, medicoData.disponibilidades);

      // const nuevoMedico = {usuario, matricula, nombre, especialidades, practicas, sedes, disponibilidades};
      const medicoGuardado = await this.medicoRepository.save(nuevoMedico);

      return medicoGuardado;
  }

    async obtenerIdsEspecialidades(especialidades){
      const especialidadesIds = [];

      for (const e of especialidades) {

       const existe = await this.especialidadRepository.findByNombre(e.nombre);

        if(existe){
          especialidadesIds.push(existe._id);
        }else{
             const especialidad = new Especialidad(
              e.nombre,
              e.duracionTurnoEnMins,
              e.costoConsulta
            );

            const guardada = await this.especialidadRepository.save(especialidad);
            especialidadesIds.push(guardada._id);
        }
      }

      return especialidadesIds;
   }

   async obtenerIdsPracticas(practicas){
    const practicasIds = [];

    for (const p of practicas) {

      const existe = await this.practicaRepository.findByCodigoYNombre(p.codigo,p.nombre);

        if(existe){
          practicasIds.push(existe._id);
        }
        else{
            const practica = new Practica(
              p.codigo,
              p.nombre,
              p.duracionTurnoEnMins,
              p.costo
            );

          const guardada = await this.practicaRepository.save(practica);
          practicasIds.push(guardada._id);
        }    
    }
    return practicasIds;
   }

   async obtenerIdsSedes(sedes){
    const sedesIds = [];

    for (const s of sedes) {

      const existe = await this.sedeRepository.findByNombre(s.nombre);

        if(existe){
          sedesIds.push(existe._id);
        }else{
          const sede = new Sede(
            s.nombre,
            s.direccion
          );
        
          const guardada = await this.sedeRepository.save(sede);
          sedesIds.push(guardada._id);
        }      
    }
    return sedesIds;
   }   

  async obtenerTodos() {

    const medicos = await this.medicoRepository.findAll()
     return medicos;
  }

  async obtenerPorId(id) {
    const medico = await this.medicoRepository.findById(id)

    return medico;
  }

  async agregarDisponibilidad(medicoId, disponibilidadCompleta) {
    try {
      const medico =  await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

      //le agrego la disponibilidad al doc del medico
      const nuevaDisponibilidad = disponibilidadCompleta.disponibilidadHoraria;
      
      medico.agregarDisponibilidad(nuevaDisponibilidad);
   
      
      //persisto en mongo
      await medico.save();

      const nuevaDisponibilidadObj = medico.disponibilidades[medico.disponibilidades.length - 1]; 
      const  objSede = await this.sedeRepository.findByNombre(disponibilidadCompleta.sede.nombre);
      const tipoDeServicio = disponibilidadCompleta.tipoDeServicio;
 

        if(disponibilidadCompleta.servicio.codigo == undefined){    
            const especialidadObj = await this.especialidadRepository.findByNombre(disponibilidadCompleta.servicio.nombre);
            setImmediate(() => {
            this.generarTurnosPorAnio(medico, nuevaDisponibilidadObj, objSede, especialidadObj, tipoDeServicio);
            })

        }else{
           
            const practicaObj = await this.practicaRepository.findByCodigoYNombre(disponibilidadCompleta.servicio.codigo, disponibilidadCompleta.servicio.nombre);
            setImmediate(() => {
            this.generarTurnosPorAnio(medico, nuevaDisponibilidadObj, objSede, practicaObj, tipoDeServicio);
            })
        }           
        
        return medico;

    } catch (error) {
      throw new Error(error.message)
    }
  }

  async generarTurnosPorAnio(medico, disponibilidad, sede, servicio, tipoDeServicio) {
    try {
      this.agendaService.generarTurnosParaDisponibilidad(medico, disponibilidad, sede, servicio, tipoDeServicio)
    } catch (error) {
      throw new Error('error al delegar la generación de turnos por disponibildad al serviceAgenda')
    }
  }

 async modificarDisponibilidad(medicoId, disponibilidadId, nuevaDisponibilidad) {
    try {
      const medico = await this.medicoRepository.findById(medicoId);

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

     const disponibilidad = medico.disponibilidades.id(disponibilidadId);
      
   
  
      if (!disponibilidad) {
        throw new Error('Disponibilidad no encontrada')
      }

     const disponibilidadAnteriorObj = new DisponibilidadHoraria(disponibilidad.diaSemana, disponibilidad.horaDesde, disponibilidad.horaHasta);
     const nuevaDisponibilidadObj = new DisponibilidadHoraria(nuevaDisponibilidad.diaSemana, nuevaDisponibilidad.horaDesde, nuevaDisponibilidad.horaHasta);

  
      if(nuevaDisponibilidad.diaSemana != undefined){
          disponibilidad.diaSemana = nuevaDisponibilidad.diaSemana
      }
      if(nuevaDisponibilidad.horaDesde != undefined){
          disponibilidad.horaDesde = nuevaDisponibilidad.horaDesde
      }
      if(nuevaDisponibilidad.horaHasta != undefined){
        disponibilidad.horaHasta = nuevaDisponibilidad.horaHasta
      }
      await medico.save()

      setImmediate(() => {
          this.generarTurnosPorAnioParaDisponibilidadModificada(
          medico,
          disponibilidadAnteriorObj,
          nuevaDisponibilidadObj
        )
      })

      return medico

    } catch (error) {
      throw new Error(error.message)
    }
  }

  generarTurnosPorAnioParaDisponibilidadModificada(
    medico,
    disponibilidadAnterior,
    disponibilidadModificada
  ) {
    this.agendaService.cambiarTurnosPorDisponibilidadModificada(
      medico,
      disponibilidadAnterior,
      disponibilidadModificada
    )
  }

  
 
}
