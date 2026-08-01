import { PracticaModel } from '../schemasBD/practicaSchema.js'

export class PracticaRepository {
  constructor() {
    this.PracticaModel = PracticaModel
  }

  async findAll() {
    return await this.PracticaModel.find()
  }

  async findByFilters(filtros = {}) {
    return await this.PracticaModel.find(filtros)
  }

  async findById(id) {
    return await this.PracticaModel.findById(id)
  }

  async findByCodigoYNombre(codigoPractica, nombre) {
    return await this.PracticaModel.findOne({ codigo: codigoPractica, nombre: nombre })
  }

  async save(practica) {
    if (!practica._id && !practica.id) {
      return await this.PracticaModel.create(practica)
    }

    const id = practica._id || practica.id
    return await this.PracticaModel.findOneAndUpdate({ _id: id }, practica, {
      returnDocument: 'after',
      runValidators: true,
    })
  }

  async delete(id) {
    return await this.PracticaModel.findByIdAndDelete(id)
  }
}
