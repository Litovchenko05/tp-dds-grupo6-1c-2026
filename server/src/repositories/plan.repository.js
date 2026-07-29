import mongoose from 'mongoose'
import { PlanModel } from '../schemasBD/planSchema.js'

export class PlanRepository {
  constructor() {
    this.PlanModel = PlanModel
  }

  async findAll() {
    return await this.PlanModel.find()
  }

  async findByFilters(filtros = {}) {
    return await this.PlanModel.find(filtros)
  }

  async findById(id) {
    return await this.PlanModel.findById(id)
  }

  async findByNombre(nombreDePlan) {
    return await this.PlanModel.findOne({ nombre: nombreDePlan })
  }

  async save(plan) {
    //Si tiene id es update, si no es create
    const query = plan._id ? { _id: plan._id } : { _id: new this.ObraSocialModel()._id }

    return await this.PlanModel.findOneAndUpdate(query, plan, {
      returnDocument: 'after',
      runValidators: true,
      upsert: true,
    })
  }

  async delete(id) {
    return await this.PlanModel.findByIdAndDelete(id)
  }
}
