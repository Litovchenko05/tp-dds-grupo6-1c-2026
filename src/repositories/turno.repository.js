import { TurnoModel } from '../shemasBD/turnoSchema.js'
export class TurnoRepository {

  constructor(datosIniciales = []) {
    this.TurnoModel = TurnoModel
  }

  async findAll() {
    return await this.TurnoModel.find()
  }

  async findByFilters(filtros = {}) {
    return await this.TurnoModel.find(filtros)
  }

  async findById(id) {
    return await this.TurnoModel.findById(id)
  }

  async findByMedicoId(idMedico) {
    return await this.TurnoModel.find({ 'medico.id': idMedico })
  }

  async save(turno) {
    //Si tiene id es update, si no es create
    const query = turno.id ? { _id: turno.id } : { _id: new this.TurnoModel()._id }

    //Si no existe, lo crea (por upsert: true).
    return await this.TurnoModel.findOneAndUpdate(query, turno.toJSON(), {
      returnDocument: 'after',
      runValidators: true,
      upsert: true,
    })
  }

  async delete(id) {
    return await this.TurnoModel.findByIdAndDelete(id)
  }

  async update(id, turnoModificado) {
    return await this.TurnoModel.findByIdAndUpdate(id, turnoModificado, { new: true });
  }



  async count(){
    return this.TurnoModel.countDocuments();
  }
}
