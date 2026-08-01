import { ObraSocialModel } from '../schemasBD/obraSocialSchema.js'

export class ObraSocialRepository {
  constructor() {
    this.ObraSocialModel = ObraSocialModel
  }

  async findAll() {
    return await this.ObraSocialModel.find().populate('planes')
  }

  async findByFilters(filtros = {}) {
    return await this.ObraSocialModel.find(filtros)
  }

  async findById(id) {
    return await this.ObraSocialModel.findById(id)
  }

  async findByNombre(nombreObraSocial) {
    return await this.ObraSocialModel.findOne({ nombre: nombreObraSocial })
  }

  async save(obraSocial) {
    //Si tiene id es update, si no es create
    const query = obraSocial._id ? { _id: obraSocial._id } : { _id: new this.ObraSocialModel()._id }

    return await this.ObraSocialModel.findOneAndUpdate(query, obraSocial, {
      returnDocument: 'after',
      runValidators: true,
      upsert: true,
    })
  }

  async delete(id) {
    return await this.ObraSocialModel.findByIdAndDelete(id)
  }
}
