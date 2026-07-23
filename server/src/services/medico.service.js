import { Medico } from '../models/Medico.js'
import { DisponibilidadHoraria } from '../models/disponibilidadHoraria.js'
import { Especialidad } from '../models/Especialidad.js'
import { Practica } from '../models/Practica.js'
import { Sede } from '../models/Sede.js'

export class MedicoService {
  constructor({
    medicoRepository,
    agendaService,
    turnoService,
    especialidadRepository,
    practicaRepository,
    sedeRepository,
    servicioRepository
  }) {
    this.medicoRepository = medicoRepository
    this.turnoService = turnoService
    this.agendaService = agendaService
    this.especialidadRepository = especialidadRepository
    this.practicaRepository = practicaRepository
    this.sedeRepository = sedeRepository
    this.servicioRepository = servicioRepository
  }

  async createMedico(medicoData) {
    if (!medicoData.usuario || !medicoData.matricula || !medicoData.nombre) {
      throw new Error('Faltán los campos de usuario, matricula o nombre!')
    }

    const existente = await this.medicoRepository.findByNombre(medicoData.nombre)
    if (existente) {
      throw new Error('El médico ya existe')
    }

    const nuevoMedico = new Medico(medicoData.usuario, medicoData.matricula, medicoData.nombre)

    const medicoGuardado = await this.medicoRepository.save(nuevoMedico)

    return medicoGuardado
  }

  async obtenerTodos() {
    const medicos = await this.medicoRepository.findAll()
    return medicos
  }

  async obtenerPorId(id) {
    const medico = await this.medicoRepository.findById(id)
    return medico
  }

  async agregarServicio(medicoId, servicio) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Medico no encontrado')
      }
      let nuevoServicio
      if ('codigo' in servicio) {
        nuevoServicio = new Practica(
          servicio.codigo,
          servicio.nombre,
          servicio.duracionTurnoEnMins,
          servicio.costo
        )
      } else {
        nuevoServicio = new Especialidad(
          servicio.nombre,
          servicio.duracionTurnoEnMins,
          servicio.costoConsulta
        )
      }
      medico.darDeAltaServicio(nuevoServicio)
      await medico.save()
    } catch (error) {
      throw error
    }
  }
  async agregarServicio(medicoId, servicio) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Medico no encontrado')
      }
      let nuevoServicio
      if ('codigo' in servicio) {
        nuevoServicio = new Practica(
          servicio.codigo,
          servicio.nombre,
          servicio.duracionTurnoEnMins,
          servicio.costo
        )
      } else {
        nuevoServicio = new Especialidad(
          servicio.nombre,
          servicio.duracionTurnoEnMins,
          servicio.costoConsulta
        )
      }
      medico.darDeAltaServicio(nuevoServicio)
      await medico.save()
    } catch (error) {
      throw error
    }
  }

  async agregarDisponibilidad(medicoId, disponibilidad) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

      //le agrego la disponibilidad al doc del medico
      const nuevaDisponibilidad = new DisponibilidadHoraria(disponibilidad.diaSemana,disponibilidad.horaDesde,disponibilidad.horaHasta);

      medico.agregarDisponibilidad(nuevaDisponibilidad)

      //persisto en mongo
      await medico.save()

      const nuevaDisponibilidadObj = medico.disponibilidades[medico.disponibilidades.length - 1]
      // const objSede = await this.sedeRepository.findById(disponibilidad.sedeId)
      const tipoDeServicio = disponibilidad.tipoDeServicio
      const tipoDeServicioNormalizado = tipoDeServicio.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
      
      // if (tipoDeServicioNormalizado == "especialidad") {
        // const servicioObj = await this.servicioRepository.findById(
        //   disponibilidad.servicioId
        // )
        setImmediate(() => {
          this.generarTurnosPorAnio(
            medicoId,
            nuevaDisponibilidadObj,
            disponibilidad.sedeId,
            disponibilidad.servicioId,
            tipoDeServicioNormalizado,
            disponibilidad.duracion
          )
        })
      //} // else {
      //   const practicaObj = await this.practicaRepository.findById(
      //     disponibilidad.servicioId
      //   )
      //   setImmediate(() => {
      //     this.generarTurnosPorAnio(
      //       medicoId,
      //       nuevaDisponibilidadObj,
      //       objSede,
      //       practicaObj,
      //       tipoDeServicioNormalizado
      //     )
      //   })
      // }

      return medico
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async generarTurnosPorAnio(medicoId, disponibilidad, sedeId, servicioId, tipoDeServicio, duracion) {
    try {
      this.agendaService.generarTurnosParaDisponibilidad(
        medicoId,
        disponibilidad,
        sedeId,
        servicioId,
        tipoDeServicio,
        duracion
      )
    } catch (error) {
      throw error
    }
  }

  async modificarDisponibilidad(medicoId, disponibilidadId, nuevaDisponibilidad) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

      const disponibilidad = medico.disponibilidades.id(disponibilidadId)

      if (!disponibilidad) {
        throw new Error('Disponibilidad no encontrada')
      }

      const disponibilidadAnteriorObj = new DisponibilidadHoraria(
        disponibilidad.diaSemana,
        disponibilidad.horaDesde,
        disponibilidad.horaHasta
      )
      const nuevaDisponibilidadObj = new DisponibilidadHoraria(
        nuevaDisponibilidad.diaSemana,
        nuevaDisponibilidad.horaDesde,
        nuevaDisponibilidad.horaHasta
      )

      if (nuevaDisponibilidad.diaSemana != undefined) {
        disponibilidad.diaSemana = nuevaDisponibilidad.diaSemana
      }
      if (nuevaDisponibilidad.horaDesde != undefined) {
        disponibilidad.horaDesde = nuevaDisponibilidad.horaDesde
      }
      if (nuevaDisponibilidad.horaHasta != undefined) {
        disponibilidad.horaHasta = nuevaDisponibilidad.horaHasta
      }
      await medico.save()

      const tipoDeServicioNormalizado = null;

      if(nuevaDisponibilidad.tipoDeServicio != undefined){
         tipoDeServicioNormalizado =  nuevaDisponibilidad.tipoDeServicio.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
      }
      
      
      setImmediate(() => {
        this.generarTurnosPorAnioParaDisponibilidadModificada(
          medico,
          disponibilidadAnteriorObj,
          nuevaDisponibilidadObj,
          nuevaDisponibilidad.duracion,
          nuevaDisponibilidad.sedeId,
          nuevaDisponibilidad.servicioId,
          tipoDeServicioNormalizado
        )
      })

      return medico
    } catch (error) {
      throw error
    }
  }
  async modificarServicio(medicoId, servicioNombre, nuevoServicio) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }
      let index
      if ('codigo' in nuevoServicio) {
        const practicaAnterior = medico.practicas.find((n) => n.nombre == servicioNombre)

        const servicioNuevo = new Practica(
          nuevoServicio.codigo,
          nuevoServicio.nombre,
          nuevoServicio.duracionTurnoEnMins,
          nuevoServicio.costo
        )

        index = medico.practicas.findIndex((p) => p.nombre === practicaAnterior.nombre)

        medico.practicas[index].codigo = nuevoServicio.codigo
        medico.practicas[index].nombre = nuevoServicio.nombre
        medico.practicas[index].duracionTurnoEnMins = nuevoServicio.duracionTurnoEnMins
        medico.practicas[index].costo = nuevoServicio.costo

        await medico.save()
      } else {
        const especialidadAnterior = medico.especialidades.find((n) => n.nombre == servicioNombre)

        const servicioNuevo = new Especialidad(
          nuevoServicio.nombre,
          nuevoServicio.duracionTurnoEnMins,
          nuevoServicio.costoConsulta
        )

        index = medico.especialidades.findIndex((p) => p.nombre === especialidadAnterior.nombre)
        medico.especialidades[index].nombre = nuevoServicio.nombre
        medico.especialidades[index].duracionTurnoEnMins = nuevoServicio.duracionTurnoEnMins
        medico.especialidades[index].costoConsulta = nuevoServicio.costoConsulta
        await medico.save()
      }
    } catch (error) {
      throw error
    }
  }
  async eliminarServicio(nombreServicio, tipoDeServicio, medicoId) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)
      let servicio

      if (tipoDeServicio == 'practica') {
        servicio = medico.practicas.find((n) => n.nombre == nombreServicio)
      } else if (tipoDeServicio == 'especialidad') {
        servicio = medico.especialidades.find((n) => n.nombre == nombreServicio)
      }

      medico.darDeBajaServicio(servicio)
      await medico.save()
    } catch (error) {
      throw error
    }
  }

  generarTurnosPorAnioParaDisponibilidadModificada(
    medico,
    disponibilidadAnterior,
    disponibilidadModificada,
    duracion,
    sedeId,
    servicioId,
    tipoDeServicio
  ) {
    this.agendaService.cambiarTurnosPorDisponibilidadModificada(
      medico,
      disponibilidadAnterior,
      disponibilidadModificada,
      duracion,
      sedeId,
      servicioId,
      tipoDeServicio
    )
  }
}
