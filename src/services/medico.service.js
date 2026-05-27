import { MedicoRepository } from '../repositories/medico.repository.js'
import { Medico } from '../models/Medico.js'
import { DisponibilidadHoraria } from '../models/disponibilidadHoraria.js'

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

  async agregarDisponibilidad(medicoId, disponibilidad) {
    try {
      const medico =  await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }
      const nuevaDisponibilidad = new DisponibilidadHoraria(
        disponibilidad.diaSemana,
        disponibilidad.horaDesde,
        disponibilidad.horaHasta
      )
      //le agrego la disponibilidad al medico
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

 async modificarDisponibilidad(medicoId, disponibilidadId, nuevaDisponibilidad) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

      const disponibilidadAnterior = {
          diaSemana: disponibilidad.diaSemana,
          horaDesde: disponibilidad.horaDesde,
          horaHasta: disponibilidad.horaHasta,
      }

     const disponibilidad = medico.disponibilidades.id(disponibilidadId)

      if (!disponibilidad) {
        throw new Error('Disponibilidad no encontrada')
      }


      disponibilidad.diaSemana = nuevaDisponibilidad.diaSemana

      disponibilidad.horaDesde = nuevaDisponibilidad.horaDesde

      disponibilidad.horaHasta = nuevaDisponibilidad.horaHasta

      await medico.save()

      setImmediate(() => {
          this.generarTurnosPorAnioParaDisponibilidadModificada(
          medico,
          disponibilidadAnterior,
          nuevaDisponibilidad
        )
      })

      return medico

    } catch (error) {
      throw new Error('Error en modificar disponibilidad para el médico')
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
