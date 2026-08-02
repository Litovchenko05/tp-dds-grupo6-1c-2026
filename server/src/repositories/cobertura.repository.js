import mongoose from 'mongoose'
import { CoberturaModel } from '../schemasBD/coberturaSchema.js'

export class CoberturaRepository {
  constructor() {
    this.CoberturaModel = CoberturaModel
  }

  async findAll() {
    return await this.CoberturaModel.find()
  }

  async findByFilters(filtros = {}) {
    return await this.CoberturaModel.find(filtros)
  }

  async findById(id) {
    return await this.CoberturaModel.findById(id)
  }

  async findByNombre(nombre) {
    return await this.CoberturaModel.findOne({ nombre: nombre })
  }

  async save(cobertura) {
    //Si tiene id es update, si no es create
    const query = cobertura._id ? { _id: cobertura._id } : { _id: new this.CoberturaModel()._id }

    return await this.CoberturaModel.findOneAndUpdate(query, cobertura, {
      returnDocument: 'after',
      runValidators: true,
      upsert: true,
    })
  }

  async delete(id) {
    return await this.CoberturaModel.findByIdAndDelete(id)
  }
}
