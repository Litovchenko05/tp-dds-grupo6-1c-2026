import { SedeModel } from '../schemasBD/sedeSchema.js'

export class SedeRepository {
  constructor() {
    this.SedeModel = SedeModel
  }

  async findAll() {
    return await this.SedeModel.find()
  }

  async findByFilters(filtros = {}) {
    return await this.SedeModel.find(filtros)
  }

  async findById(id) {
    return await this.SedeModel.findById(id)
  }

  async findByNombre(nombreSede) {
    return await this.SedeModel.findOne({ nombre: nombreSede })
  }

  async save(sede) {
    //Si tiene id es update, si no es create
    const query = sede.id ? { _id: sede.id } : { _id: new this.SedeModel()._id }

    return await this.SedeModel.findOneAndUpdate(query, sede, {
      returnDocument: 'after',
      runValidators: true,
      upsert: true,
    })
  }

  async delete(id) {
    return await this.SedeModel.findByIdAndDelete(id)
  }
}
