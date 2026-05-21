import { notificacionRepository } from '../repositories/datosPrueba.enMemoria.js'

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

  obtenerTodas(filtroLeida = null) {
    let notificaciones

    if (filtroLeida === null) {
      notificaciones = this.notificacionRepository.obtenerTodos()
    } else if (filtroLeida === true) {
      notificaciones = this.notificacionRepository.obtenerLeidas()
    } else {
      notificaciones = this.notificacionRepository.obtenerNoLeidas()
    }

    return notificaciones.map(this.#mapToDto)
  }

  obtenerNoLeidas() {
    const notificaciones = this.notificacionRepository.obtenerNoLeidas()

    return notificaciones.map(this.#mapToDto)
  }
}
