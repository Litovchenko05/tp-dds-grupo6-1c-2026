import { MedicoModel } from '../schemasBD/medicoSchema.js'

export class MedicoRepository {
  constructor() {
    this.MedicoModel = MedicoModel
  }

  async findAll() {
    return await this.MedicoModel.find()
  }

  async findByFilters(filtros = {}) {
    return await this.MedicoModel.find(filtros)
  }

  async findById(id) {
    return await this.MedicoModel.findById(id)
      .populate('especialidades')
      .populate('practicas')
      .populate('sedes')
  }

  async findByNombre(nombreMedico) {
    return await this.MedicoModel.findOne({ nombre: nombreMedico })
  }

  async findByMatricula(matricula) {
    return await this.MedicoModel.findOne({ matricula: matricula })
  }

  async findByUsuario(usuarioId) {
    return await this.MedicoModel.findOne({ usuario: usuarioId }).select('matricula usuario')
  }

  async save(medico) {
    //Si tiene id es update, si no es create
    const query = medico.id ? { _id: medico.id } : { _id: new this.MedicoModel()._id }

    //Busca un medico con ese _id y la actualiza con los datos de medico.
    //Si no existe, la crea (por upsert: true).
    return await this.MedicoModel.findOneAndUpdate(query, medico, {
      returnDocument: 'after',
      runValidators: true,
      upsert: true,
    })
  }

  async delete(id) {
    return await this.MedicoModel.findByIdAndDelete(id)
  }

  async findAllPaginated(page = 1, limit = 5) {
    //cuantos documentos hay que saltar
    const skip = (page - 1) * limit

    const medicos = await this.MedicoModel.find() //.find({ eliminado: false }) -> recrodar si usamos esto para baja logica
      .skip(skip)
      .limit(limit)

    const total = await this.MedicoModel.countDocuments({
      //eliminado: false
    })

    return {
      medicos,
      total,
      page,
      // por ejemplo para 23 con x por pagina -> 4.6 necesito 5 paginas la ultima no completa
      totalPages: Math.ceil(total / limit),
    }
  }
}
