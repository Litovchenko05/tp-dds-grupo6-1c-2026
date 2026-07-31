import mongoose from 'mongoose'
import { TurnoModel } from '../schemasBD/turnoSchema.js'
import { EstadoTurno } from '../models/estadoTurno.enum.js'
import { ServicioRepository } from '../repositories/servicios.repository.js'
import { Cobertura } from '../models/Cobertura.js'
import { NivelDeCobertura } from '../models/nivelDeCobertura.js'
import { Types } from 'mongoose'
export class TurnoRepository {
  constructor(medicoRepository, pacienteRepository, planRepository, coberturaRepository) {
    this.TurnoModel = TurnoModel
    this.medicoRepository = medicoRepository
    this.pacienteRepository = pacienteRepository
    this.planRepository = planRepository
    this.coberturaRepository = coberturaRepository
  }

  async findAll() {
    return await this.TurnoModel.find()
      .populate('practica')
      .populate('especialidad')
      .populate('sede')
  }

  async findByFilters(filtros = {}) {
    return await this.TurnoModel.find(filtros)
  }

  async findById(id) {
    return await this.TurnoModel.findById(id)
      .populate('medico', 'nombre')
      .populate('servicio', 'nombre')
      .populate('sede', 'nombre')
  }

  async findByTurnoId(idMedico) {
    return await this.TurnoModel.find({ 'medico.id': idMedico }).populate('servicio')
  }

  async findByUsuario(usuarioId) {
    const paciente = await this.pacienteRepository.findByUsuario(usuarioId)

    const turnos = await this.TurnoModel.find({
      paciente: paciente._id,
      estado: { $in: [EstadoTurno.RESERVADO, EstadoTurno.CONFIRMADO] },
    })
      .populate('medico', 'nombre')
      .populate('servicio', 'nombre')
      .populate('sede', 'nombre')

    return turnos
  }
  async save(turno) {
    //Si tiene id es update, si no es create
    const query = turno._id ? { _id: turno._id } : { _id: new this.TurnoModel()._id }

    //Si no existe, lo crea (por upsert: true).
    return await this.TurnoModel.findOneAndUpdate(query, turno.toJSON(), {
      returnDocument: 'after',
      runValidators: true,
      upsert: true,
    })
  }

  async obtenerTurnosPorProfesional(nombreDeProfesional) {
    return await this.TurnoModel.find({ 'medico.nombre': nombreDeProfesional })
  }

  async obtenerTurnosPorEspecialidad(nombreDeEspecialidad) {
    return (await this.findAll()).filter(
      (t) => t.especialidad?.nombre?.toLowerCase() == nombreDeEspecialidad.toLowerCase()
    )
  }

  async obtenerTurnosPorPractica(nombreDePractica) {
    return (await this.findAll()).filter(
      (t) => t.practica?.nombre?.toLowerCase() == nombreDePractica.toLowerCase()
    )
  }

  async obtenerTurnosPorSede(nombreSede) {
    return (await this.findAll()).filter(
      (t) => t.sede.nombre.toLowerCase() == nombreSede.toLowerCase()
    )
  }

  async obtenerTurnosPorRango(fechaIncial, fechaFinal) {
    return await this.TurnoModel.find({
      fechaHora: {
        $gte: new Date(fechaIncial),
        $lte: new Date(fechaFinal),
      },
    })
  }
  async actualizarHistoral(turno, idUsuario) {
    const paciente = await this.pacienteRepository.findByUsuario(idUsuario)
    if (paciente == null) {
    }

    paciente.historialDeTurnos.push(turno)

    const indice = paciente.turnos.findIndex((t) => t._id.toString() === turno._id.toString())

    if (indice !== -1) {
      paciente.turnos.splice(indice, 1)
    }
    await this.pacienteRepository.save(paciente)
    return
  }

  async saveMany(turnos) {
    await this.TurnoModel.insertMany(turnos)
  }

  async delete(id) {
    return await this.TurnoModel.findByIdAndDelete(id)
  }

  async eliminarTurnosDeServicioPorMedico(idMedico, idServicio) {
    const resultado = await TurnoModel.deleteMany({
      medico: idMedico,
      servicio: idServicio,
      estado: 'disponible',
    })
    return resultado
  }

  async update(id, turnoModificado) {
    return await this.TurnoModel.findByIdAndUpdate(id, turnoModificado, { new: true })
  }

  async count() {
    return this.TurnoModel.countDocuments()
  }

  async obtenerTurnosParaManiana() {
    const hoy = new Date()
    const maniana = new Date(hoy)
    maniana.setDate(maniana.getDate() + 1)

    const inicioManiana = new Date(maniana)
    inicioManiana.setHours(0, 0, 0, 0)
    const finManiana = new Date(maniana)
    finManiana.setHours(23, 59, 59, 999)

    return await this.TurnoModel.find({
      fechaHora: {
        $gte: inicioManiana,
        $lte: finManiana,
      },
      estado: EstadoTurno.RESERVADO,
    })
  }

  async findAllFilteredPaginated({
    idUsuario,
    nombreMedico,
    idServicio,
    idSede,
    fechaDesde,
    fechaHasta,
    tipoServicio,
    page = 1,
    limit = 5,
    sortBy = 'fechaHora',
    order = 'asc',
  }) {
    const normalizar = (str) =>
      str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()

    const skip = (page - 1) * limit
    const sortOrder = order === 'asc' ? 1 : -1

    const filtro = {
      estado: 'disponible',
    }

    if (nombreMedico) {
      const todosLosMedicos = await this.medicoRepository.findAll()

      const nombreBuscado = normalizar(nombreMedico)

      const medicos = todosLosMedicos.filter((medico) => {
        const nombreNormalizado = normalizar(medico.nombre)

        return nombreNormalizado.includes(nombreBuscado)
      })

      const idsMedicos = medicos.map((m) => m._id)

      filtro.medico = {
        $in: idsMedicos,
      }
    }

    if (idServicio) {
      filtro.servicio = idServicio
    }

    if (idSede) {
      filtro.sede = idSede
    }

    if (fechaDesde || fechaHasta) {
      filtro.fechaHora = {}
      if (fechaDesde) {
        filtro.fechaHora.$gte = new Date(fechaDesde)
      }
      if (fechaHasta) {
        const hasta = new Date(fechaHasta)
        hasta.setHours(23, 59, 59, 999)
        filtro.fechaHora.$lte = hasta
      }
    }

    if (tipoServicio) {
      filtro.tipoDeServicio = tipoServicio
    }

    // Mapeo de sortBy a campo de Mongoose
    const sortFields = {
      fecha: 'fechaHora',
      costo: 'costo',
    }
    const campoSort = sortFields[sortBy] || 'fechaHora'

    const turnos = await this.TurnoModel.find(filtro)
      .populate('medico', 'nombre')
      .populate('sede', 'nombre')
      .populate('servicio', 'nombre')
      .sort({ [campoSort]: sortOrder })
      .skip(skip)
      .limit(limit)

    const total = await this.TurnoModel.countDocuments(filtro)

    const pacienteEncontrado = await this.pacienteRepository.findByUsuario(idUsuario)

    let coberturas = []

    if (pacienteEncontrado?.plan) {
      const plan = await this.planRepository.findById(pacienteEncontrado.plan)

      if (plan?.coberturasDeServicios?.length) {
        coberturas = await Promise.all(
          plan.coberturasDeServicios.map((coberturaId) =>
            this.coberturaRepository.findById(coberturaId)
          )
        )
      }
    }

    const turnosConCobertura = turnos.map((turno) => {
      const turnoObj = turno.toObject ? turno.toObject() : turno

      const cobertura = coberturas.find(
        (c) => c && c.servicio.toString() === turnoObj.servicio._id.toString()
      )

      if (cobertura) {
        return {
          ...turnoObj,
          costoConCobertura: this.calcularDescuento(cobertura, turnoObj.costo),
          nivelCobertura: cobertura.nivel.nivel,
        }
      }

      return {
        ...turnoObj,
        costoConCobertura: turnoObj.costo,
        nivelCobertura: 'NO_CUBIERTA',
      }
    })

    return {
      turnos: turnosConCobertura,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findAllPaginated(idUsuario, page = 1, limit = 5, sortBy = 'fecha', order = 'asc') {
    const skip = (page - 1) * limit
    const sortOrder = order === 'asc' ? 1 : -1

    const filtro = {
      estado: 'disponible',
    }

    const sortFields = {
      fecha: 'fechaHora',
      costo: 'costo',
    }
    const campoSort = sortFields[sortBy] || 'fechaHora'

    const turnos = await this.TurnoModel.find(filtro)
      .populate('medico', 'nombre')
      .populate('sede', 'nombre')
      .populate('servicio', 'nombre')
      .sort({ [campoSort]: sortOrder })
      .skip(skip)
      .limit(limit)

    const total = await this.TurnoModel.countDocuments(filtro)

    const pacienteEncontrado = await this.pacienteRepository.findByUsuario(idUsuario)

    let coberturas = []

    if (pacienteEncontrado?.plan) {
      const plan = await this.planRepository.findById(pacienteEncontrado.plan)

      if (plan?.coberturasDeServicios?.length) {
        coberturas = await Promise.all(
          plan.coberturasDeServicios.map((coberturaId) =>
            this.coberturaRepository.findById(coberturaId)
          )
        )
      }
    }

    const turnosConCobertura = turnos.map((turno) => {
      const turnoObj = turno.toObject ? turno.toObject() : turno

      const cobertura = coberturas.find(
        (c) => c && c.servicio.toString() === turnoObj.servicio._id.toString()
      )

      if (cobertura) {
        return {
          ...turnoObj,
          costoConCobertura: this.calcularDescuento(cobertura, turnoObj.costo),
          nivelCobertura: cobertura.nivel.nivel,
        }
      }

      return {
        ...turnoObj,
        costoConCobertura: turnoObj.costo,
        nivelCobertura: 'NO_CUBIERTA',
      }
    })

    return {
      turnos: turnosConCobertura,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  calcularDescuento(cobertura, costoInicial) {
    const nivel = cobertura.nivel.nivel
    if (nivel == NivelDeCobertura.TOTAL) {
      return costoInicial * 0
    } else if (nivel == NivelDeCobertura.PARCIAL) {
      return costoInicial / 2
    } else if (nivel == NivelDeCobertura.NO_CUBIERTA) {
      return costoInicial
    }
  }

  async buscarServiciosPaginados(
    page = 1,
    limit = 5,
    especialidadId = 'todas',
    practicaId = 'todas'
  ) {
    const skip = (page - 1) * limit

    const condiciones = []

    if (especialidadId === 'ninguna') {
    } else if (especialidadId === 'todas') {
      condiciones.push({ 'servicioInfo.tipo': 'especialidad' })
    } else {
      condiciones.push({ servicio: new Types.ObjectId(especialidadId) })
    }

    if (practicaId === 'ninguna') {
    } else if (practicaId === 'todas') {
      condiciones.push({ 'servicioInfo.tipo': 'practica' })
    } else {
      condiciones.push({ servicio: new Types.ObjectId(practicaId) })
    }

    const matchFinal = condiciones.length ? { $or: condiciones } : { _id: null }

    const pipeline = [
      {
        $lookup: {
          from: 'servicios',
          localField: 'servicio',
          foreignField: '_id',
          as: 'servicioInfo',
        },
      },
      { $unwind: '$servicioInfo' },
      { $match: matchFinal },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: { medico: '$medico', servicio: '$servicio' },
          turnoId: { $first: '$_id' },
        },
      },
    ]

    const primerosTurnos = await this.TurnoModel.aggregate(pipeline)
    const ids = primerosTurnos.map((t) => t.turnoId)
    const total = ids.length

    const turnos = await this.TurnoModel.find({ _id: { $in: ids } })
      .populate('medico', 'nombre')
      .populate('sede', 'nombre')
      .populate('servicio', 'nombre tipo')
      .sort({ costo: 1 })
      .skip(skip)
      .limit(limit)

    return { turnos, total, page, totalPages: Math.ceil(total / limit) }
  }
}
