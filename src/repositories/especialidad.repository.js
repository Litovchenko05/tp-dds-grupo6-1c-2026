import { EspecialidadModel } from '../schemasBD/especialidadSchema.js'

export class EspecialidadRepository {

  constructor() {
    this.EspecialidadModel = EspecialidadModel
  }

  async findAll() {
    return await this.EspecialidadModel.find()
  }

  async findByFilters(filtros = {}) {
    return await this.EspecialidadModel.find(filtros)
  }


  async findById(id) {
    return await this.EspecialidadModel.findById(id)
  }

  async findByNombre(nombreEspecialidad) {
    return await this.EspecialidadModel.findOne({ nombre: nombreEspecialidad })
  }

  async save(especialidad) {
    //Si tiene id es update, si no es create
    const query = especialidad.id ? { _id: especialidad.id } : { _id: new this.EspecialidadModel()._id }


    return await this.EspecialidadModel.findOneAndUpdate(
      query,
      especialidad,
      {
        returnDocument: 'after',
        runValidators: true,
        upsert: true
      }
    )
  }


  async delete(id) {
    return await this.EspecialidadModel.findByIdAndDelete(id)
  }

}
