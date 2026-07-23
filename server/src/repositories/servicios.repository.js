import { ServicioModel } from '../schemasBD/servicioSchema.js'

export class ServicioRepository {

  constructor() {
    this.ServicioModel = ServicioModel
  }

  async findAll() {
    return await this.ServicioModel.find()
  }

  async findByFilters(filtros = {}) {
    return await this.ServicioModel.find(filtros)
  }


  async findById(id) {
    return await this.ServicioModel.findById(id)
  }

  async findByNombre(nombreDeServicio) {
    return await this.ServicioModel.findOne({ nombre: nombreDeServicio })
  }

  async save(servicio) {
    //Si tiene id es update, si no es create
    const query = servicio._id ? { _id: servicio._id } : { _id: new this.ServicioModel()._id }


    return await this.ServicioModel.findOneAndUpdate(
      query,
      servicio,
      {
        returnDocument: 'after',
        runValidators: true,
        upsert: true
      }
    )
  }


  async delete(id) {
    return await this.ServicioModel.findByIdAndDelete(id)
  }

}
