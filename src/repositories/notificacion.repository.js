import { NotificacionModel } from '../shemasBD/notificacionSchema.js'

export class NotificacionRepository {
  constructor() {
    this.NotificacionModel = NotificacionModel
  }

  #consultaBase() {
    return this.NotificacionModel.find().populate('destinatario').populate('remitente')
  }

  #filtroPorUsuario(idUsuario, consulta) {
    if (idUsuario == null) {
      return consulta
    }

    return consulta.find({
      $or: [{ destinatario: idUsuario }, { 'destinatario._id': idUsuario }],
    })
  }

  async save(notificacion) {
    if (!notificacion) {
      throw new Error('La notificacion no puede ser nula')
    }

    const datos = typeof notificacion.toJSON === 'function' ? notificacion.toJSON() : notificacion
    const query = datos.id != null ? { _id: datos.id } : { _id: new this.NotificacionModel()._id }

    const restoDatos = { ...datos }
    delete restoDatos.id
    delete restoDatos._id

    return await this.NotificacionModel.findOneAndUpdate(query, restoDatos, {
      returnDocument: 'after',
      runValidators: true,
      upsert: true,
    })
      .populate('destinatario')
      .populate('remitente')
  }

  async obtenerTodos() {
    return await this.#consultaBase()
  }

  async obtenerPorId(idNotificacion) {
    return await this.NotificacionModel.findById(idNotificacion)
      .populate('destinatario')
      .populate('remitente')
  }

  async marcarComoLeida(idNotificacion) {
    return await this.NotificacionModel.findByIdAndUpdate(
      idNotificacion,
      {
        leida: true,
        fechaHoraLeida: new Date(),
      },
      {
        returnDocument: 'after',
        runValidators: true,
      }
    )
      .populate('destinatario')
      .populate('remitente')
  }

  async obtenerTodosDeUsuario(idUsuario) {
    return await this.#filtroPorUsuario(idUsuario, this.#consultaBase())
  }

  async obtenerLeidasDeUsuario(idUsuario) {
    return await this.#filtroPorUsuario(idUsuario, this.#consultaBase().where({ leida: true }))
  }

  async obtenerNoLeidasDeUsuario(idUsuario) {
    return await this.#filtroPorUsuario(idUsuario, this.#consultaBase().where({ leida: false }))
  }

  async eliminarPorId(idNotificacion) {
    const resultado = await this.NotificacionModel.findByIdAndDelete(idNotificacion)
    return resultado !== null
  }

  async limpiar() {
    await this.NotificacionModel.deleteMany({})
  }

  async cargar(notificaciones = []) {
    for (const notificacion of notificaciones) {
      await this.guardar(notificacion)
    }
  }
}
