import { TurnoModel } from '../shemasBD/turnoSchema.js'
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
    return await this.TurnoModel.findById(id)
  }

  async findByTurnoId(idMedico) {
    return await this.TurnoModel.find({ 'medico.id': idMedico }).populate('servicio')
  }

  async save(turno) {
    //Si tiene id es update, si no es create
    const query = turno.id ? { _id: turno.id } : { _id: new this.TurnoModel()._id }

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
}
