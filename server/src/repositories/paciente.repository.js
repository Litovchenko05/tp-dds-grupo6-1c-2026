import { PacienteModel } from '../schemasBD/pacienteSchema.js'

export class PacienteRepository {
  constructor() {
    this.PacienteModel = PacienteModel
  }

  async findAll() {
    return await this.PacienteModel.find()
  }

  async findByFilters(filtros = {}) {
    return await this.PacienteModel.find(filtros)
  }

  async findOne(filtros = {}) {
    return await this.PacienteModel.findOne(filtros)
  }

  async findById(id) {
    return await this.PacienteModel.findById(id)
  }

  async findByDni(dniPaciente) {
    return await this.PacienteModel.findOne({ dni: dniPaciente })
  }

  async findByUsuario(usuarioId) {
    return await this.PacienteModel.findOne({ usuario: usuarioId })
  }

  async findByNombre(nombre) {
    return await this.PacienteModel.find({
      nombre: { $regex: nombre.trim(), $options: 'i' },
    }).select('_id')
  }

  async save(paciente) {
    const query = paciente.id ? { _id: paciente.id } : { _id: new this.PacienteModel()._id }

    return await this.PacienteModel.findOneAndUpdate(query, paciente, {
      returnDocument: 'after',
      runValidators: true,
      upsert: true,
    })
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

  async findAllPaginated(page = 1, limit = 5) {
    //cuantos documentos hay que saltar
    const skip = (page - 1) * limit

    const pacientes = await this.PacienteModel.find() //.find({ eliminado: false }) -> recrodar si usamos esto para baja logica
      .skip(skip)
      .limit(limit)

    const total = await this.PacienteModel.countDocuments({
      //eliminado: false
    })

    return {
      pacientes,
      total,
      page,
      // por ejemplo para 23 con x por pagina -> 4.6 necesito 5 paginas la ultima no completa
      totalPages: Math.ceil(total / limit),
    }
  }

  async findByIdWithCobertura(id) {
    return await this.PacienteModel.findById(id).populate('obraSocial').populate('plan')
  }
}
