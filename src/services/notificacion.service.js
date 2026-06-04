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

    return notificaciones;
  }

  async marcarComoLeida(idNotificacion) {
    const notificacion = await this.notificacionRepository.marcarComoLeida(idNotificacion)

    if (!notificacion) {
      return null
    }

    return notificacion;
  }
}
