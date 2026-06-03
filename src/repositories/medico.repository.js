import {MedicoModel} from '../shemasBD/medicoSchema.js';

export class MedicoRepository {

  constructor(datosIniciales = []){
    this.MedicoModel = MedicoModel;
  }

  async findAll(){
    return await this.MedicoModel.find(); 
  }

  async findByFilters(filtros = {}){
    return await this.MedicoModel.find(filtros);
  }

  
  async findById(id){
    return await this.MedicoModel.findById(id);
  }

  async findByNombre(nombreMedico){
    return await this.MedicoModel.findOne({ nombre: nombreMedico });
  }

  async save(medico){
    //Si tiene id es update, si no es create
    const query = medico.id ? { _id: medico.id } : { _id: new this.MedicoModel()._id };
        
    //Busca un medico con ese _id y la actualiza con los datos de medico.
    //Si no existe, la crea (por upsert: true).
    return await this.MedicoModel.findOneAndUpdate(
      query,
      medico,
      { 
        new: true,
        runValidators: true,
        upsert: true
      }
      );
  }
  //medico.toJSON(),

  async delete(id){
    return await this.MedicoModel.findByIdAndDelete(id);
  }

  // guardar(medico) {
  //   if (!medico || medico.id == null) {
  //     throw new Error('El medico debe tener un id para guardarse en memoria')
  //   }

  //   const indiceExistente = this.#medicos.findIndex((m) => m.id === medico.id)

  //   if (indiceExistente >= 0) {
  //     this.#medicos[indiceExistente] = medico
  //   } else {
  //     this.#medicos.push(medico)
  //   }

  //   return medico
  // }

  // obtenerTodos() {
  //   return [...this.#medicos]
  // }

  // obtenerPorId(idMedico) {
  //   return this.#medicos.find((medico) => medico.id === idMedico) ?? null
  // }

  // eliminarPorId(idMedico) {
  //   const cantidadInicial = this.#medicos.length
  //   this.#medicos = this.#medicos.filter((medico) => medico.id !== idMedico)
  //   return this.#medicos.length < cantidadInicial
  // }

  // limpiar() {
  //   this.#medicos = []
  // }

  // cargar(medicos = []) {
  //   medicos.forEach((medico) => this.guardar(medico))
  // }
}
