import { UsuarioModel } from '../shemasBD/usuarioSchema.js'

export class UsuarioRepository {
  constructor() {
    this.UsuarioModel = UsuarioModel
  }

  async findAll() {
    return await this.UsuarioModel.find()
  }

  async findByFilters(filtros = {}) {
    return await this.UsuarioModel.find(filtros)
  }

  async findById(id) {
    return await this.UsuarioModel.findById(id)
  }

  async findByNombreUsuario(nombreUsuario) {
    return await this.UsuarioModel.findOne({ nombreUsuario })
  }

  async save(usuario) {
    const datos = typeof usuario?.toJSON === 'function' ? usuario.toJSON() : usuario
    const identificador = datos?.id ?? datos?._id ?? new this.UsuarioModel()._id

    const datosParaGuardar = { ...datos }
    delete datosParaGuardar.id
    delete datosParaGuardar._id

    return await this.UsuarioModel.findOneAndUpdate({ _id: identificador }, datosParaGuardar, {
      returnDocument: 'after',
      runValidators: true,
      upsert: true,
    })
  }

  async delete(id) {
    return await this.UsuarioModel.findByIdAndDelete(id)
  }
}
