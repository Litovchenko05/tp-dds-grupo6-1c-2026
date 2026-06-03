export class NotificacionService {
  constructor({ notificacionRepository }) {
    this.notificacionRepository = notificacionRepository
  }

  #mapToDto(n) {
    return {
      id: n.id,
      destinatario: {
        id: n.destinatario?.id,
        nombre: n.destinatario?.nombre,
        dni: n.destinatario?.dni,
        usuario: n.destinatario?.usuario,
      },
      remitente: n.remitente,
      mensaje: n.mensaje,
      fechaHoraCreacion: n.fechaHoraCreacion,
      fechaHoraLeida: n.fechaHoraLeida,
      leida: n.leida,
    }
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

    return notificaciones.map(this.#mapToDto)
  }

  async marcarComoLeida(idNotificacion) {
    const notificacion = await this.notificacionRepository.marcarComoLeida(idNotificacion)

    if (!notificacion) {
      return null
    }

    return this.#mapToDto(notificacion)
  }
}
