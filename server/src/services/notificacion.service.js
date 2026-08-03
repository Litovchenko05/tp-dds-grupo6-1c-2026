import { Notificacion } from '../models/Notificacion.model.js'

export class NotificacionService {
  constructor({ notificacionRepository }) {
    this.notificacionRepository = notificacionRepository
  }

  async obtenerDeUsuario(idUsuario, filtroLeida = null) {
    let notificaciones

    if (filtroLeida === null) {
      notificaciones = await this.notificacionRepository.obtenerTodosDeUsuario(idUsuario)
    } else if (filtroLeida === true) {
      notificaciones = await this.notificacionRepository.obtenerLeidasDeUsuario(idUsuario)
    } else {
      notificaciones = await this.notificacionRepository.obtenerNoLeidasDeUsuario(idUsuario)
    }

    return notificaciones
  }

  async marcarComoLeida(idNotificacion) {
    const notificacion = await this.notificacionRepository.marcarComoLeida(idNotificacion)

    if (!notificacion) {
      return null
    }

    return notificacion
  }

  async crearNotificacion(data) {
    const nuevaNotificacion = new Notificacion({
      destinatario: data.destinatarioId,
      mensaje: data.mensaje,
    })

    return await this.notificacionRepository.save(nuevaNotificacion)
  }

  async crearNotificacionesEnLote(listaData) {
    const loteNotificaciones = listaData.map((data) => {
      return new Notificacion({
        destinatario: data.destinatarioId,
        mensaje: data.mensaje,
      })
    })

    return await this.notificacionRepository.saveMany(loteNotificaciones)
  }

  generarNotificacion(destinatario, remitente, mensaje) {
    const nuevaNotificacion = {
      destinatario,
      remitente,
      mensaje,
      fechaHoraCreacion: new Date(),
      leida: false,
    }
    this.notificacionRepository.crear(nuevaNotificacion)
  }
}
