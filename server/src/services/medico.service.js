import { Medico } from '../models/Medico.js'
import { DisponibilidadHoraria } from '../models/disponibilidadHoraria.js'
import { Especialidad } from '../models/Especialidad.js'
import { Practica } from '../models/Practica.js'

export class MedicoService {
  constructor({
    medicoRepository,
    agendaService,
    turnoService,
    notificacionService,
    especialidadRepository,
    practicaRepository,
    sedeRepository,
    servicioRepository,
  }) {
    this.medicoRepository = medicoRepository
    this.turnoService = turnoService
    this.notificacionService = notificacionService
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

  async agregarServicio(medicoId, data) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Medico no encontrado')
      }
      if (data.data.tipo == 'practica') {
        const nuevaPractica = new Practica(
          data.data.servicioId,
          data.data.duracion,
          data.data.costo,
          data.data.sede
        )
        const practicaGuardada = await this.practicaRepository.save(nuevaPractica)
        medico.darDeAltaPractica(practicaGuardada)
      } else {
        const nuevaEspecialidad = new Especialidad(
          data.data.servicioId,
          data.data.duracion,
          data.data.costo,
          data.data.sede
        )
        const especialidadGuardada = await this.especialidadRepository.save(nuevaEspecialidad)
        medico.darDeAltaEspecialidad(especialidadGuardada)
      }
      await this.medicoRepository.save(medico)
    } catch (error) {
      throw error
    }
  }

  async agregarDisponibilidad(medicoId, data) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

      const nuevaDisponibilidad = new DisponibilidadHoraria(
        data.diaSemana,
        data.horaDesde,
        data.horaHasta
      )
      medico.agregarDisponibilidad(nuevaDisponibilidad)
      await this.medicoRepository.save(medico)

      const nuevaDisponibilidadObj = medico.disponibilidades[medico.disponibilidades.length - 1]
      const tipoDeServicio = data.tipoDeServicio
      const tipoDeServicioNormalizado = tipoDeServicio
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()

      setImmediate(() => {
        this.generarTurnosPorAnio(
          medicoId,
          nuevaDisponibilidadObj,
          data.sedeId,
          data.servicioId,
          tipoDeServicioNormalizado,
          data.duracion,
          data.costo
        )
      })

      return medico
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async generarTurnosPorAnio(
    medicoId,
    disponibilidad,
    sedeId,
    servicioId,
    tipoDeServicio,
    duracion,
    costo
  ) {
    try {
      this.agendaService.generarTurnosParaDisponibilidad(
        medicoId,
        disponibilidad,
        sedeId,
        servicioId,
        tipoDeServicio,
        duracion,
        costo
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

      const tipoDeServicioNormalizado = null

      if (nuevaDisponibilidad.tipoDeServicio != undefined) {
        tipoDeServicioNormalizado = nuevaDisponibilidad.tipoDeServicio
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .trim()
      }

      setImmediate(() => {
        this.generarTurnosPorAnioParaDisponibilidadModificada(
          medico,
          disponibilidadAnteriorObj,
          nuevaDisponibilidadObj,
          nuevaDisponibilidad.duracion,
          nuevaDisponibilidad.sedeId,
          nuevaDisponibilidad.servicioId,
          tipoDeServicioNormalizado,
          nuevaDisponibilidad.costo
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
    disponibilidadModificada,
    duracion,
    sedeId,
    servicioId,
    tipoDeServicio,
    costo
  ) {
    this.agendaService.cambiarTurnosPorDisponibilidadModificada(
      medico,
      disponibilidadAnterior,
      disponibilidadModificada,
      duracion,
      sedeId,
      servicioId,
      tipoDeServicio,
      costo
    )
  }

  async obtenerServicios(medicoId) {
    try {
      const medico = await this.medicoRepository.findWithDetallesById(medicoId)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

      const especialidades = medico.especialidades || []
      const practicas = medico.practicas || []
      const disponibilidades = medico.disponibilidades || []

      console.log(disponibilidades)

      const combinados = [
        ...especialidades.map((e) => ({ item: e, tipo: 'Especialidad' })),
        ...practicas.map((p) => ({ item: p, tipo: 'Practica' })),
      ]

      const respuestaEnriquecida = combinados.map(({ item, tipo }) => {
        const disp = disponibilidades.find(
          (d) =>
            d.servicioId?.toString() === item._id?.toString() ||
            d.servicioId?.toString() === item.servicio?._id?.toString()
        )
        return {
          _id: item._id,
          nombre: item.servicio?.nombre || 'Servicio Sin Nombre',
          tipo: tipo,
          sede: item.sede?.nombre || 'Sede sin asignar',
          duracion: `${item.duracionTurnoEnMins || item.duracionEnMins || 30} min`,
          precio: item.costoConsulta || item.costo || 0,
          diaSemana: disp?.diaSemana || null,
          horaDesde: disp?.horaDesde || null,
          horaHasta: disp?.horaHasta || null,
        }
      })

      return respuestaEnriquecida
    } catch (error) {
      throw error
    }
  }

  async obtenerTurnosMedico(medicoId, filtros = {}) {
    const medico = await this.medicoRepository.findById(medicoId)
    if (!medico) {
      throw new Error('Médico no encontrado')
    }

    const {
      estadoTurno,
      estado,
      nombreServicio,
      paciente,
      fechaDesde,
      fechaHasta,
      page = 1,
      limit = 10,
    } = filtros

    const filterObj = { medico: medicoId }

    const estadoFiltro = estado || estadoTurno
    if (estadoFiltro) {
      filterObj.estado = estadoFiltro.toUpperCase()
    }

    if (fechaDesde || fechaHasta) {
      filterObj.fechaHora = {}
      if (fechaDesde) filterObj.fechaHora.$gte = new Date(fechaDesde)
      if (fechaHasta) {
        const hasta = new Date(fechaHasta)
        hasta.setHours(23, 59, 59, 999)
        filterObj.fechaHora.$lte = hasta
      }
    }

    if (paciente?.trim()) {
      const pacientes = await this.turnoService.turnoRepository.pacienteRepository.findByNombre(
        paciente
      )
      filterObj.paciente = { $in: pacientes.map((pacienteEncontrado) => pacienteEncontrado._id) }
    }

    const pageNum = parseInt(page) || 1
    const limitNum = parseInt(limit) || 10
    const skip = (pageNum - 1) * limitNum

    const turnos = await this.turnoService.turnoRepository.TurnoModel.find(filterObj)
      .populate({
        path: 'paciente',
        populate: { path: 'usuario', select: 'nombre email' },
      })
      .populate('servicio', 'nombre')
      .populate('sede', 'nombre')
      .sort({ fechaHora: 1 })
      .skip(skip)
      .limit(limitNum)

    const total = await this.turnoService.turnoRepository.TurnoModel.countDocuments(filterObj)

    return {
      turnos,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    }
  }

  async obtenerEstadisticas(medicoId) {
    const medico = await this.medicoRepository.findById(medicoId)
    if (!medico) {
      throw new Error('Médico no encontrado')
    }

    const hoyInicio = new Date()
    hoyInicio.setHours(0, 0, 0, 0)
    const hoyFin = new Date()
    hoyFin.setHours(23, 59, 59, 999)

    const turnosHoy = await this.turnoService.turnoRepository.TurnoModel.countDocuments({
      medico: medicoId,
      fechaHora: { $gte: hoyInicio, $lte: hoyFin },
    })

    const cancelacionesHoy = await this.turnoService.turnoRepository.TurnoModel.countDocuments({
      medico: medicoId,
      estado: 'CANCELADO',
      fechaHora: { $gte: hoyInicio, $lte: hoyFin },
    })

    const turnosProximos = await this.turnoService.turnoRepository.TurnoModel.find({
      medico: medicoId,
      fechaHora: { $gte: new Date() },
      estado: { $in: ['RESERVADO', 'CONFIRMADO', 'DISPONIBLE'] },
    })
      .populate({
        path: 'paciente',
        populate: { path: 'usuario', select: 'nombre email' },
      })
      .populate('servicio', 'nombre')
      .populate('sede', 'nombre')
      .sort({ fechaHora: 1 })
      .limit(5)

    let notificacionesCount = 0
    if (this.notificacionService && medico.usuario) {
      try {
        const idUsuario = medico.usuario._id || medico.usuario
        const noLeidas = await this.notificacionService.notificacionRepository.obtenerNoLeidasDeUsuario(idUsuario)
        notificacionesCount = Array.isArray(noLeidas) ? noLeidas.length : 0
      } catch (err) {
        console.error('Error al obtener notificaciones del médico:', err)
      }
    }

    return {
      turnosHoy,
      cancelacionesHoy,
      notificacionesCount,
      proximosTurnos: turnosProximos,
    }
  }
}
