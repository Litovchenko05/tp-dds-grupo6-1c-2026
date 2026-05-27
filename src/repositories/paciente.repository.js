import { PacienteModel } from '../shemasBD/pacienteSchema.js'

export class PacienteRepository {
  constructor(datosIniciales = []) {
    this.PacienteModel = PacienteModel
  }

  async findAll() {
    return await this.PacienteModel.find()
  }

  async findByFilters(filtros = {}) {
    return await this.PacienteModel.find(filtros)
  }

  async findById(id) {
    return await this.PacienteModel.findById(id)
  }

  async findByDni(dniPaciente) {
    return await this.PacienteModel.findOne({ 'usuario.dni': dniPaciente })
  }

  async save(paciente) {
    const query = paciente.id ? { _id: paciente.id } : { _id: new this.PacienteModel()._id }

    return await this.PacienteModel.findOneAndUpdate(
      query,
      paciente.toJSON ? paciente.toJSON() : paciente,
      {
        returnDocument: 'after',
        runValidators: true,
        upsert: true,
      }
    )
  }

  async delete(id) {
    return await this.PacienteModel.findByIdAndDelete(id)
  }

  async obtenerTodos() {
    return await this.findAll()
  }

  async obtenerPorId(id) {
    return await this.findById(id)
  }
}
