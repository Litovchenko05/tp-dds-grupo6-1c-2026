import { MedicoRepository } from '../repositories/medico.repository.js'
import { Medico } from '../models/Medico.js'
import { DisponibilidadHoraria } from '../models/disponibilidadHoraria.js'
import { Practica } from '../models/Practica.js'
import { Especialidad } from '../models/Especialidad.js'
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

  obtenerPorId(id) {
    const medico = this.medicoRepository.obtenerPorId(Number(id))

    return medico ? this.#mapToDto(medico) : null
  }
  agregarServicio(medicoId, servicio){
    try{
      const medico = this.medicoRepository.obtenerPorId(Number(medicoId))
      if(!medico){
        throw new Error('Medico no encontrado')
      }
      if("codigo" in servicio){
        const nuevoServicio = new Practica(
          servicio.codigo,
          servicio.nombre,
          servicio.duracionTurnoEnMins,
          servicio.costo
        )
      }else{
        const nuevoServicio = new Especialidad(
          servicio.nombre,
          servicio.duracionTurnoEnMins,
          servicio.costoConsulta
        )
      }
      medico.darDeAltaServicio(nuevoServicio)
    }catch(error){
      throw new Error('error en agregar servicio para el médico')
    }
  }

  agregarDisponibilidad(medicoId, disponibilidad) {
    try {
      const medico = this.medicoRepository.obtenerPorId(Number(medicoId))

      if (!medico) {
        throw new Error('Médico no encontrado')
      }
      const nuevaDisponibilidad = new DisponibilidadHoraria(
        disponibilidad.diaSemana,
        disponibilidad.horaDesde,
        disponibilidad.horaHasta
      )
      medico.definirDisponibilidad(nuevaDisponibilidad)

      setImmediate(() => {
        this.generarTurnosPorAnio(medico, nuevaDisponibilidad)
      })
    } catch (error) {
      throw new Error('error en agregar disponibilidad para el médico')
    }
  }

  async generarTurnosPorAnio(medico, disponibilidad) {
    try {
      this.agendaService.generarTurnosParaDisponibilidad(medico, disponibilidad)
    } catch (error) {
      throw new Error('error al delegar la generación de turnos por disponibildad al serviceAgenda')
    }
  }

  modificarDisponibilidad(medicoId, disponibilidadId, nuevaDisponibilidad) {
    try {
      const medico = this.medicoRepository.obtenerPorId(Number(medicoId))

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

      if (disponibilidadId < 0 || disponibilidadId >= medico.disponibilidades.length) {
        throw new Error('Disponibilidad no encontrada para el médico')
      }

      const disponibilidadAnterior = medico.disponibilidades[disponibilidadId]

      const disponibilidadNuevaObj = new DisponibilidadHoraria(
        nuevaDisponibilidad.diaSemana,
        nuevaDisponibilidad.horaDesde,
        nuevaDisponibilidad.horaHasta
      )

      console.log(
        'Disponibilidad existente antes de la modificación: ',
        disponibilidadAnterior.diaSemana +
          ' ' +
          disponibilidadAnterior.horaDesde +
          ' - ' +
          disponibilidadAnterior.horaHasta
      )

      medico.modificarDisponibilidad(disponibilidadId, disponibilidadNuevaObj)

      console.log(
        'Disponibilidad existente después de la modificación: ',
        medico.disponibilidades[disponibilidadId].diaSemana +
          ' ' +
          medico.disponibilidades[disponibilidadId].horaDesde +
          ' - ' +
          medico.disponibilidades[disponibilidadId].horaHasta
      )

      setImmediate(() => {
        this.generarTurnosPorAnioParaDisponibilidadModificada(
          medico,
          disponibilidadAnterior,
          disponibilidadNuevaObj
        )
      })
    } catch (error) {
      throw new Error('Error en modificar disponibilidad para el médico')
    }
  }
  modificarServicio(medicoId, servicioId, nuevoServicio){
      try{
      const medico = this.medicoRepository.obtenerPorId(Number(medicoId))

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

     if("codigo" in nuevoServicio){
        if (servicioId < 0 || servicioId >= medico.practicas.length) {
        throw new Error('Practica no encontrada para el médico')
      }

      const practicaAnterior = medico.practicas[servicioId]
        const servicioNuevo = new Practica(
          nuevoServicio.codigo,
          nuevoServicio.nombre,
          nuevoServicio.duracionTurnoEnMins,
          nuevoServicio.costo
        )

        console.log(
        'Practica existente antes de la modificación: ',
        practicaAnterior.codigo +
          ' ' +
          practicaAnterior.nombre +
          ' ' +
          practicaAnterior.duracionTurnoEnMins +
          ' ' +
          practicaAnterior.costo
      )

      medico.modificarServicio(practicaAnterior, servicioNuevo)

      console.log(
        'Practica existente después de la modificación: ',
         medico.practicas[servicioId].codigo +
          ' ' +
          medico.practicas[servicioId].nombre +
          ' ' +
          medico.practicas[servicioId].duracionTurnoEnMins +
          ' ' +
          medico.practicas[servicioId].costo
      )

      }else{
       
        if (servicioId < 0 || servicioId >= medico.especialidades.length) {
        throw new Error('Especialidad no encontrada para el médico')
      }

      const especialidadAnterior = medico.especialidades[servicioId]

       const servicioNuevo = new Especialidad(
          nuevoServicio.nombre,
          nuevoServicio.duracionTurnoEnMins,
          nuevoServicio.costoConsulta
        )
          console.log(
        'Especialidad existente antes de la modificación: ',
          especialidadAnterior.nombre +
          ' ' +
          especialidadAnterior.duracionTurnoEnMins +
          ' ' +
          especialidadAnterior.costoConsulta
      )
       medico.modificarServicio(especialidadAnterior, servicioNuevo)

       console.log(
        'Especialidad existente después de la modificación: ',
          medico.especialidades[servicioId].nombre +
          ' ' +
          medico.especialidades[servicioId].duracionTurnoEnMins +
          ' ' +
          medico.especialidades[servicioId].costoConsulta
      )
      }
      


      }
      catch(error){
        throw new Error('Error en modificar servicio para el médico')
      }
  }
  eliminarServicio(idServicio, tipoDeServicio,medicoId){
    
    try{
      const medico = this.medicoRepository.obtenerPorId(Number(medicoId))
      let servicio
          if(tipoDeServicio == "practica"){
            servicio = medico.practicas[idServicio]
            
          }else if(tipoDeServicio == "especialidad"){
            servicio = medico.especialidades[idServicio]
          }
          medico.darDeBajaServicio(servicio)}
    catch(error){
      throw new Error("error al eliminar el servicio para el medico")
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
