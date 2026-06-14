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
    //Si tiene id es update, si no es create
    const query = practica.id ? { _id: practica.id } : { _id: new this.PracticaModel()._id }

    return await this.PracticaModel.findOneAndUpdate(
      query,
      practica,
      {
        returnDocument: 'after',
        runValidators: true,
        upsert: true
      }
    )
  }


  async delete(id) {
    return await this.PracticaModel.findByIdAndDelete(id)
  }

}
