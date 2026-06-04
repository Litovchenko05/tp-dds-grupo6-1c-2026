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
    return await this.MedicoModel.findById(id)
    .populate('especialidades')
    .populate('practicas')
    .populate('sedes');
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
        returnDocument: 'after',
        runValidators: true,
        upsert: true
      }
      );
  }
  

  async delete(id){
    return await this.MedicoModel.findByIdAndDelete(id);
  }

}
