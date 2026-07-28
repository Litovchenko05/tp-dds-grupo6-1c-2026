import mongoose from "mongoose";
import { TurnoModel } from '../schemasBD/turnoSchema.js'
import { EstadoTurno } from '../models/estadoTurno.enum.js'

export class TurnoRepository {
  constructor() {
    this.TurnoModel = TurnoModel
  }

  async findAll() {
    return await this.TurnoModel.find().populate('servicio').populate('sede')
  }

  async findByFilters(filtros = {}) {
    return await this.TurnoModel.find(filtros)
  }

  async findById(id) {
    return await this.TurnoModel.findById(id).populate('medico', 'nombre').populate('servicio', 'nombre').populate('sede', 'nombre')
  }

  async findByTurnoId(idMedico) {
    return await this.TurnoModel.find({ 'medico.id': idMedico }).populate('servicio')
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
      (t) =>
        t.servicio.nombre.toLowerCase() == nombreDeEspecialidad.toLowerCase() &&
        t.tipoDeServicio == 'Especialidad'
    )
  }

  async obtenerTurnosPorPractica(nombreDePractica) {
    return (await this.findAll()).filter(
      (t) =>
        t.servicio.nombre.toLowerCase() == nombreDePractica.toLowerCase() &&
        t.tipoDeServicio == 'Practica'
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

  async saveMany(turnos) {
    await this.TurnoModel.insertMany(turnos)
  }

  async delete(id) {
    return await this.TurnoModel.findByIdAndDelete(id)
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

  async buscarTurnosPaginated({
    nombreMedico,
    nombreServicio,
    sede,
    fechaDesde,
    fechaHasta,
    estadoTurno = 'DISPONIBLE',
    page = 1,
    limit = 5,
    sortBy = 'fechaHora',
    order = 'asc',
  }) {
    const skip = (page - 1) * limit
    const sortOrder = order === 'asc' ? 1 : -1

    // Construir filtro dinámico
    const filtro = {
      estado: estadoTurno,
    }

    if (nombreMedico) {
      filtro['medico.nombre'] = { $regex: nombreMedico, $options: 'i' }
    }

    if (nombreServicio) {
      filtro.$or = [
        { 'practica.nombre': { $regex: nombreServicio, $options: 'i' } },
        { 'practica.especialidad': { $regex: nombreServicio, $options: 'i' } },
      ]
    }

    if (sede) {
      filtro['sede.nombre'] = { $regex: sede, $options: 'i' }
    }

    if (fechaDesde || fechaHasta) {
      filtro.fechaHora = {}
      if (fechaDesde) {
        filtro.fechaHora.$gte = new Date(fechaDesde)
      }
      if (fechaHasta) {
        filtro.fechaHora.$lte = new Date(fechaHasta)
      }
    }

    // Mapeo de sortBy a campo de Mongoose
    const sortFields = {
      fecha: 'fechaHora',
      costo: 'practica.costo',
      medico: 'medico.nombre',
    }
    const campoSort = sortFields[sortBy] || 'fechaHora'

    // Ejecutar búsqueda
    const turnos = await this.TurnoModel.find(filtro)
      .sort({ [campoSort]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean() // Retorna objetos JavaScript planos, no documentos Mongoose

    const total = await this.TurnoModel.countDocuments(filtro)

    return {
      turnos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }
  //paginado
  //GET ALL PAGINADO
  async findAllPaginated(page = 1, limit = 5) {
  
    //cuantos documentos hay que saltar
    const skip = (page - 1) * limit

    const turnos =
      await this.TurnoModel
        .find() //.find({ eliminado: false }) -> recrodar si usamos esto para baja logica
        .populate('medico', 'nombre')
        .populate('sede', 'nombre')
        .populate('servicio', 'nombre')
        .skip(skip)
        .limit(limit)
  
    const total =
      await this.TurnoModel.countDocuments({
        //eliminado: false
      })

    return {
      turnos,
      total,
      page,
      // por ejemplo para 23 con x por pagina -> 4.6 necesito 5 paginas la ultima no completa
      totalPages: Math.ceil(total / limit)
    }
  }
}