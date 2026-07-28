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
  }) {
    this.medicoRepository = medicoRepository
    this.turnoService = turnoService
    this.agendaService = agendaService
    this.especialidadRepository = especialidadRepository
    this.practicaRepository = practicaRepository
    this.sedeRepository = sedeRepository
  }

  async createMedico(medicoData) {
    if (!medicoData.usuario || !medicoData.matricula || !medicoData.nombre) {
      throw new Error('Todos los campos son requeridos')
    }

    const existente = await this.medicoRepository.findByNombre(medicoData.nombre)
    if (existente) {
      throw new Error('El médico ya existe')
    }

    const nuevoMedico = new Medico(medicoData.usuario, medicoData.matricula, medicoData.nombre)

    const medicoGuardado = await this.medicoRepository.save(nuevoMedico)

    return medicoGuardado
  }

  async obtenerIdsEspecialidades(especialidades) {
    const especialidadesIds = []

    for (const e of especialidades) {
      const existe = await this.especialidadRepository.findByNombre(e.nombre)

      if (existe) {
        especialidadesIds.push(existe._id)
      } else {
        const especialidad = new Especialidad(e.nombre, e.duracionTurnoEnMins, e.costoConsulta)

        const guardada = await this.especialidadRepository.save(especialidad)
        especialidadesIds.push(guardada._id)
      }
    }

    return especialidadesIds
  }

  async obtenerIdsPracticas(practicas) {
    const practicasIds = []

    for (const p of practicas) {
      const existe = await this.practicaRepository.findByCodigoYNombre(p.codigo, p.nombre)

      if (existe) {
        practicasIds.push(existe._id)
      } else {
        const practica = new Practica(p.codigo, p.nombre, p.duracionTurnoEnMins, p.costo)

        const guardada = await this.practicaRepository.save(practica)
        practicasIds.push(guardada._id)
      }
    }
    return practicasIds
  }

  async obtenerIdsSedes(sedes) {
    const sedesIds = []

    for (const s of sedes) {
      const existe = await this.sedeRepository.findByNombre(s.nombre)

      if (existe) {
        sedesIds.push(existe._id)
      } else {
        const sede = new Sede(s.nombre, s.direccion)

        const guardada = await this.sedeRepository.save(sede)
        sedesIds.push(guardada._id)
      }
    }
    return sedesIds
  }

  async obtenerTodos() {
    const medicos = await this.medicoRepository.findAll()
    return medicos
  }

  async obtenerPorId(id) {
    const medico = await this.medicoRepository.findById(id)
    return medico
  }

  async agregarServicio(medicoId, data) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Medico no encontrado')
      }
      let nuevoServicio
      if (data.tipo == 'practica') {
        nuevoServicio = new Practica(data.nombre, data.duracionTurnoEnMins, data.costo)
      } else {
        nuevoServicio = new Especialidad(data.nombre, data.duracionTurnoEnMins, data.costoConsulta)
      }
      medico.darDeAltaServicio(nuevoServicio)
      await this.medicoRepository.save(medico)
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

      medico.agregarDisponibilidad(disponibilidad)

      await this.medicoRepository.save(medico)

      const nuevaDisponibilidadObj = medico.disponibilidades[medico.disponibilidades.length - 1]
      const objSede = await this.sedeRepository.findByNombre(disponibilidad.sede.nombre)
      const tipoDeServicio = disponibilidad.tipoDeServicio

      if (disponibilidad.servicio.codigo == undefined) {
        // TODO: Esto va a romper
        const especialidadObj = await this.especialidadRepository.findByNombre(
          disponibilidad.servicio.nombre // TODO: Esto va a romper
        )
        setImmediate(() => {
          this.generarTurnosPorAnio(
            medico,
            nuevaDisponibilidadObj,
            objSede,
            especialidadObj,
            tipoDeServicio
          )
        })
      } else {
        const practicaObj = await this.practicaRepository.findByCodigoYNombre(
          disponibilidad.servicio.codigo, // TODO: Esto va a romper
          disponibilidad.servicio.nombre // TODO: Esto va a romper
        )
        setImmediate(() => {
          this.generarTurnosPorAnio(
            medico,
            nuevaDisponibilidadObj,
            objSede,
            practicaObj,
            tipoDeServicio
          )
        })
      }

      return medico
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async generarTurnosPorAnio(medico, disponibilidad, sede, servicio, tipoDeServicio) {
    try {
      this.agendaService.generarTurnosParaDisponibilidad(
        medico,
        disponibilidad,
        sede,
        servicio,
        tipoDeServicio
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

      setImmediate(() => {
        this.generarTurnosPorAnioParaDisponibilidadModificada(
          medico,
          disponibilidadAnteriorObj,
          nuevaDisponibilidadObj
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

  async eliminarServicio(medicoId, nombreServicio, tipoDeServicio) {
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
    disponibilidadModificada
  ) {
    this.agendaService.cambiarTurnosPorDisponibilidadModificada(
      medico,
      disponibilidadAnterior,
      disponibilidadModificada
    )
  }

  async obtenerServicios(medicoId) {
    try {
      const medico = this.medicoRepository.findById(medicoId)
      const todosLosServicios = [...(medico.especialidades || []), ...(medico.practicas || [])]
      return todosLosServicios
    } catch (error) {
      throw error
    }
  }
}
