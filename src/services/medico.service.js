import { MedicoRepository } from '../repositories/medico.repository.js'
import { Medico } from '../models/Medico.js'
import { DisponibilidadHoraria } from '../models/disponibilidadHoraria.js'
import { Especialidad } from '../models/Especialidad.js'
import { Practica } from '../models/Practica.js'
import { Sede } from '../models/Sede.js'

export class MedicoService {
  constructor({ medicoRepository, agendaService }) {
    this.medicoRepository = new medicoRepository()
    this.agendaService = agendaService
  }

  #mapToDto(m) {
    return {
      id:  m._id,
      usuario: m.usuario,
      matricula: m.matricula,
      nombre: m.nombre,
      especialidades: Array.isArray(m.especialidades)
        ? m.especialidades.map((e) => ({
            id: e._id,
            nombre: e.nombre,
            duracionTurnoEnMins: e.duracionTurnoEnMins,
            costo: e.costo,
          }))
        : [],
      practicas: Array.isArray(m.practicas)
        ? m.practicas.map((p) => ({
            id: p._id,
            codigo: p.codigo,
            nombre: p.nombre,
            duracionTurnoEnMins: p.duracionTurnoEnMins,
            costo: p.costo,
          }))
        : [],
      sedes: Array.isArray(m.sedes)
        ? m.sedes.map((s) => ({
            id: s._id,
            nombre: s.nombre,
            direccion: s.direccion,
          }))
        : [],
      disponibilidades: Array.isArray(m.disponibilidades)
        ? m.disponibilidades.map((d) => ({
            diaSemana: d.diaSemana,
            horaDesde: d.horaDesde,
            horaHasta: d.horaHasta,
          }))
        : [],
    }
  }

  async createMedico(medicoData){
    
    const {usuario, matricula, nombre, especialidades, practicas, sedes, disponibilidades} = medicoData;

       if (!usuario || !matricula || !nombre || !especialidades || !practicas || !sedes || !disponibilidades) {
          throw new ValidationError('Todos los campos son requeridos');
       }

    const existente = await this.medicoRepository.findByNombre(nombre); 

        if (existente) {
          throw new Error ('El médico ya existe');
        }

    const nuevoMedico = new Medico(usuario, matricula, nombre, especialidades, practicas, sedes,disponibilidades);
    const medicoGuardado = await this.medicoRepository.save(nuevoMedico);

    return this.#mapToDto(medicoGuardado);
  }

  async obtenerTodos() {
    const medicos = await this.medicoRepository.findAll()

    const medicosEnDTO = medicos.map(m => {
     return this.#mapToDto(m);
    });
    
     return medicosEnDTO;
  }

  async obtenerPorId(id) {
    const medico = await this.medicoRepository.findById(id)

    return medico ? this.#mapToDto(medico) : null
  }

  async agregarDisponibilidad(medicoId, disponibilidadCompleta) {
    try {
      const medico =  await this.medicoRepository.findById(medicoId)

      console.log(medico)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

      //le agrego la disponibilidad al doc del medico
      console.log("antes de pushear la dispo");

      const nuevaDisponibilidad = disponibilidadCompleta.disponibilidadHoraria;
      
      medico.disponibilidades.push(nuevaDisponibilidad);

      console.log("despues de pushear la dispo");
      //persisto en mongo
      await medico.save()
      console.log("despues de guardar al medico con la nueva dispo en mongo");

     const objMedico = this.mapToEntidad(medico);

    console.log(objMedico.getMatricula());
    console.log(objMedico.getPracticas());
 
      const objNuevaDisponibilidad = new DisponibilidadHoraria(
                                      nuevaDisponibilidad.diaSemana,
                                      nuevaDisponibilidad.horaDesde,
                                      nuevaDisponibilidad.horaHasta
                                    );

      const objSede = new Sede(
                        disponibilidadCompleta.sede.nombre,
                        disponibilidadCompleta.sede.direccion
                      );
        if(disponibilidadCompleta.servicio.codigo == undefined){
            //es una especialidad
            const especialidadObj = new Especialidad(
            disponibilidadCompleta.servicio.nombre,
            disponibilidadCompleta.servicio.duracionTurnoEnMins,
            disponibilidadCompleta.servicio.costo);
            
            setImmediate(() => {
            this.generarTurnosPorAnio(objMedico, objNuevaDisponibilidad, objSede, especialidadObj);
            })

        }else{
            const practicaObj = new Practica(
            disponibilidadCompleta.servicio.codigo,
            disponibilidadCompleta.servicio.nombre,
            disponibilidadCompleta.servicio.duracionTurnoEnMins,
            disponibilidadCompleta.servicio.costo);

            setImmediate(() => {
            this.generarTurnosPorAnio(objMedico, objNuevaDisponibilidad, objSede, practicaObj);
            })
        }              

    } catch (error) {
      throw new Error(error.message)
    }
  }

  async generarTurnosPorAnio(medico, disponibilidad, sede, servicio) {
    try {
      this.agendaService.generarTurnosParaDisponibilidad(medico, disponibilidad, sede, servicio)
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

  mapToEntidad(medico){

    const objEspecialidades =  (medico.especialidades || []).map(e => new Especialidad(e.nombre,e.duracionTurnoEnMins,e.costoConsulta));
    const objPracticas  = (medico.practicas || []).map(p => new Practica(p.codigo,p.nombre,p.duracionTurnoEnMins,p.costo));
    const objSede = (medico.sedes || []).map(s => new Sede (s.nombre, s.direccion));
    const objDisponibilidades = (medico.disponibilidades || []).map(
                                  d => new DisponibilidadHoraria(
                                  d.diaSemana,
                                  d.horaDesde,
                                  d.horaHasta
                                  )
                                );
    const objMedico = new Medico(
                          medico.usuario,
                          medico.matricula,
                          medico.nombre,
                          objEspecialidades,
                          objPracticas,
                          objSede,
                          objDisponibilidades
                    );
      objMedico.setId(medico._id);

      console.log(objMedico.getId());

      return objMedico;
  }

 
}
