import { Medico } from '../models/Medico.js'
import { DisponibilidadHoraria } from '../models/disponibilidadHoraria.js'
import { Especialidad } from '../models/Especialidad.js'
import { Practica } from '../models/Practica.js'
import mongoose from 'mongoose'
import { Types } from 'mongoose'
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
        console.log('Practica guardada:', practicaGuardada)
        medico.darDeAltaPractica(practicaGuardada)
        await this.medicoRepository.save(medico)
        return practicaGuardada
      } else {
        const nuevaEspecialidad = new Especialidad(
          data.data.servicioId,
          data.data.duracion,
          data.data.costo,
          data.data.sede
        )
        const especialidadGuardada = await this.especialidadRepository.save(nuevaEspecialidad)
        console.log('Especialidad guardada:', especialidadGuardada)
        medico.darDeAltaEspecialidad(especialidadGuardada)
        await this.medicoRepository.save(medico)
        return especialidadGuardada
      }
    } catch (error) {
      throw error
    }
  }

  async agregarDisponibilidad(medicoId, data) {
    console.log('ENTRANDO A AGREGAR DISPONIBILIDAD')
    console.log('ID MEDICO: ', medicoId)
    console.log('DATA', data)
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
      console.log('NUEVA DISPO OBJ', nuevaDisponibilidad)
      medico.agregarDisponibilidad(nuevaDisponibilidad)
      await this.medicoRepository.save(medico)

      const nuevaDisponibilidadObj = medico.disponibilidades[medico.disponibilidades.length - 1]

      console.log('NUEVA DISPO OBJ SCADA DE LA LSITA', nuevaDisponibilidadObj)

      this.agregarDisponibilidadEnServicio(medico, data, nuevaDisponibilidadObj)

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

  agregarDisponibilidadEnServicio(medico, data, nuevaDisponibilidadObj) {
    if (data.tipoDeServicio == 'Practica') {
      const practica = medico.practicas.find((p) => p._id.toString() == data.servicioId.toString())
      console.log('Practica a agregar dispo:', practica)
      console.log('Practica disponibilidad anterior:', practica.disponibilidad)

      practica.disponibilidad = nuevaDisponibilidadObj
      console.log('Practica disponibilidad ahora:', practica.disponibilidad)
      this.practicaRepository.save(practica)
    } else if (data.tipoDeServicio == 'Especialidad') {
      const especialidad = medico.especialidades.find(
        (e) => e._id.toString() == data.servicioId.toString()
      )

      especialidad.disponibilidad = nuevaDisponibilidadObj
      this.especialidadRepository.save(especialidad)
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

  async modificarDisponibilidad(medicoId, servicioId, nuevaDisponibilidad) {
    try {
      console.log('Datos recibidos para modificar disponibilidad:', {
        medicoId,
        servicioId,
        nuevaDisponibilidad,
      })
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

      // const disponibilidad = medico.disponibilidades.id(disponibilidadId)

      let disponibilidadVieja = null

      let disponibilidadAnteriorObj = null

      if (nuevaDisponibilidad.tipoDeServicio == 'Especialidad') {
        const especialidad = medico.especialidades.find(
          (medicoEspecialidad) => medicoEspecialidad.servicio.toString() === servicioId.toString()
        )
        if (!especialidad) {
          console.log('Especialidad no encontrada')
          throw new Error('Especialidad no encontrada')
        }
        disponibilidadVieja = especialidad.disponibilidad

        disponibilidadAnteriorObj = new DisponibilidadHoraria(
          disponibilidadVieja.diaSemana,
          disponibilidadVieja.horaDesde,
          disponibilidadVieja.horaHasta
        )

        console.log('Disponibilidad vieja de la especialidad encontrada:', disponibilidadVieja)

        especialidad.disponibilidad.diaSemana = nuevaDisponibilidad.diaSemana
        especialidad.disponibilidad.horaDesde = nuevaDisponibilidad.horaDesde
        especialidad.disponibilidad.horaHasta = nuevaDisponibilidad.horaHasta

        this.especialidadRepository.save(especialidad)
      } else {
        const practica = medico.practicas.find(
          (medicoPractica) => medicoPractica.servicio.toString() === servicioId.toString()
        )
        if (!practica) {
          console.log('Práctica no encontrada')
          throw new Error('Práctica no encontrada')
        }
        disponibilidadVieja = practica.disponibilidad

        disponibilidadAnteriorObj = new DisponibilidadHoraria(
          disponibilidadVieja.diaSemana,
          disponibilidadVieja.horaDesde,
          disponibilidadVieja.horaHasta
        )

        console.log('Disponibilidad vieja de la práctica encontrada:', disponibilidadVieja)

        practica.disponibilidad.diaSemana = nuevaDisponibilidad.diaSemana
        practica.disponibilidad.horaDesde = nuevaDisponibilidad.horaDesde
        practica.disponibilidad.horaHasta = nuevaDisponibilidad.horaHasta
        this.practicaRepository.save(practica)
      }

      console.log('Disponibilidad anterior:', disponibilidadAnteriorObj)

      const nuevaDisponibilidadObj = new DisponibilidadHoraria(
        nuevaDisponibilidad.diaSemana,
        nuevaDisponibilidad.horaDesde,
        nuevaDisponibilidad.horaHasta
      )

      console.log('Disponibilidad modificada:', nuevaDisponibilidadObj)
      if (nuevaDisponibilidad.diaSemana != undefined) {
        disponibilidadVieja.diaSemana = nuevaDisponibilidad.diaSemana
      }
      if (nuevaDisponibilidad.horaDesde != undefined) {
        disponibilidadVieja.horaDesde = nuevaDisponibilidad.horaDesde
      }
      if (nuevaDisponibilidad.horaHasta != undefined) {
        disponibilidadVieja.horaHasta = nuevaDisponibilidad.horaHasta
      }

      const disponibilidadEnMedico = medico.disponibilidades.id(disponibilidadVieja._id)
      disponibilidadEnMedico.diaSemana = disponibilidadVieja.diaSemana
      disponibilidadEnMedico.horaDesde = disponibilidadVieja.horaDesde
      disponibilidadEnMedico.horaHasta = disponibilidadVieja.horaHasta
      await medico.save()

      let tipoDeServicioNormalizado = null

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
  async modificarServicio(medicoId, idServicio, nuevoServicio) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }
      const idSer = new Types.ObjectId(idServicio)

      const servicio = await this.servicioRepository.findById(idSer)

      if (!servicio) {
        throw new Error('Servicio no encontrado')
      }
      if (servicio.tipo == 'especialidad') {
        const especialidadAModificar = medico.especialidades.find(
          (e) => e.servicio.toString() == idServicio.toString()
        )

        if (nuevoServicio.costo != undefined) {
          especialidadAModificar.costoConsulta = nuevoServicio.costo
        }
        if (nuevoServicio.duracion != undefined) {
          especialidadAModificar.duracionTurnoEnMins = nuevoServicio.duracion
        }

        this.especialidadRepository.save(especialidadAModificar)

        return especialidadAModificar
      } else {
        const practicaAModificar = medico.practicas.find(
          (e) => e.servicio.toString() == idServicio.toString()
        )

        if (nuevoServicio.costo != undefined) {
          practicaAModificar.costo = nuevoServicio.costo
        }
        if (nuevoServicio.duracion != undefined) {
          practicaAModificar.duracionTurnoEnMins = nuevoServicio.duracion
        }

        this.practicaRepository.save(practicaAModificar)

        return practicaAModificar
      }
    } catch (error) {
      console.error('Error al modificar servicio:', error)
      throw error
    }
  }

  //idServicio es el id del servicio (especialidad o practica) que se quiere eliminar
  async eliminarServicio(medicoId, idServicio, tipo) {
    console.log('ID MEDICO:', medicoId)
    console.log('ID SERVICIO', idServicio)
    console.log('TIPO', tipo)
    try {
      if (tipo == 'Especialidad') {
        const especialidad = await this.especialidadRepository.findById(idServicio)
        await this.turnoService.eliminarTurnosDeServicioPorMedico(medicoId, especialidad.servicio)
      } else {
        const practica = await this.practicaRepository.findById(idServicio)
        await this.turnoService.eliminarTurnosDeServicioPorMedico(medicoId, practica.servicio)
      }

      const medico = await this.medicoRepository.findById(medicoId)

      if (medico == null) {
        throw new Error('Médico no encontrado')
      }
      if (tipo == 'Especialidad') {
        const especialidad = await this.especialidadRepository.findById(idServicio)
        console.log('especialidad a eliminar:', especialidad)
        const idDisponibilidad = especialidad.disponibilidad?._id

        console.log('id disponibilidad:', idDisponibilidad)
        medico.darDeBajaEspecialidad(idServicio, idDisponibilidad)
        await medico.save()
        const servicioEliminado = await this.especialidadRepository.delete(idServicio)
        return servicioEliminado
      } else {
        const practica = await this.practicaRepository.findById(idServicio)
        console.log('practica a eliminar:', practica)
        const idDisponibilidad = practica.disponibilidad?._id
        medico.darDeBajaPractica(idServicio, idDisponibilidad)
        await medico.save()
        const servicioEliminado = await this.practicaRepository.delete(idServicio)
        return servicioEliminado
      }

      return null
    } catch (error) {
      throw new Error(`Error al eliminar el servicio: ${error.message}`)
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

      console.log('Especialidades:', especialidades)
      console.log('Prácticas:', practicas)

      const combinados = [
        ...especialidades.map((e) => ({ item: e, tipo: 'Especialidad' })),
        ...practicas.map((p) => ({ item: p, tipo: 'Practica' })),
      ]

      const respuestaEnriquecida = combinados.map(({ item, tipo }) => {
        return {
          _id: item._id,
          idServicio: item.servicio?._id || null,
          nombre: item.servicio?.nombre || 'Servicio Sin Nombre',
          tipo: tipo,
          sede: item.sede?.nombre || 'Sede sin asignar',
          duracion: `${item.duracionTurnoEnMins || item.duracionEnMins || 30} min`,
          precio: item.costoConsulta || item.costo || 0,
          diaSemana: item.disponibilidad.diaSemana || null,
          horaDesde: item.disponibilidad.horaDesde || null,
          horaHasta: item.disponibilidad.horaHasta || null,
        }
      })
      console.log('Respuesta enriquecida de servicios:', respuestaEnriquecida)

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
      const pacientes =
        await this.turnoService.turnoRepository.pacienteRepository.findByNombre(paciente)
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
        const noLeidas =
          await this.notificacionService.notificacionRepository.obtenerNoLeidasDeUsuario(idUsuario)
        notificacionesCount = Array.isArray(noLeidas) ? noLeidas.length : 0
      } catch (err) {
        throw new Error('Error al obtener notificaciones del médico:', err)
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
