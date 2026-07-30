import { Agenda } from './Agenda.js'
import { Notificacion } from './Notificacion.model.js'
import { Turno } from './Turno.js'

//notificacionFactory-->Singleton
export class FactoryNotificacion {
  static crearSegunEstadoTurno(turno) {
    switch (turno.estado) {
      case "RESERVADO":
        return this.crearNotificacionParaTurnoReservado(turno)
      case "ACEPTADO":
        return this.crearNotificacionParaTurnoAceptado(turno)
      case "CANCELADO":
        return this.crearNotificacionParaTurnoCancelado(turno)
    }
  }

  static crearNotificacionParaTurnoReservado(turno) {
    const notificacion = new Notificacion({
      destinatario: turno.medico.usuario,
      remitente: 'Sweet Medical - Plataforma de Seguro de la Salud',
      mensaje:
        'Se ha reservado el turno #' +
        turno.id +
        ' con horario ' +
        turno.fechaHora.toLocaleDateString() +
        ' por el paciente ' +
        turno.paciente.nombre +
        'para el servicio/practica: ' +
        turno.practica.nombre,
    })

    return notificacion
  }

  static crearNotificacionParaTurnoAceptado(turno) {
    const notificacion = new Notificacion({
      destinatario: turno.paciente.usuario,
      remitente: 'Sweet Medical - Plataforma de Seguro de la Salud',
      mensaje:
        'Querido paciente ' + turno.paciente.nombre + 'tu turno #' + turno.id + ' ha sido aceptado',
    })

    return notificacion
  }

  static crearNotificacionParaTurnoCancelado(turno) {
    let usuarioQueCancela = turno.ultimoCambioEstado.usuario
    if (usuarioQueCancela.id === turno.paciente.usuario.id) {
      const notificacion = new Notificacion({
        destinatario: turno.medico.usuario,
        remitente: 'Sweet Medical - Plataforma de Seguro de la Salud',
        mensaje: 'El paciente ' + turno.paciente.nombre + ' cancelo el turno #' + turno.id,
      })
      return notificacion
    } else {
      const notificacion = new Notificacion({
        destinatario: turno.paciente.usuario,
        remitente: 'Sweet Medical - Plataforma de Seguro de la Salud',
        mensaje: 'El medico ' + turno.medico.nombre + ' cancelo el turno #' + turno.id,
      })
      return notificacion
    }
  }

  static crearNotificacionParaRecordatorioDeTurno(turno, usuarioDestinatario) {
    const notificacion = new Notificacion({
      destinatario: usuarioDestinatario,
      remitente: 'Sweet Medical - Plataforma de Seguro de la Salud',
      mensaje:
        'Recordatorio de turno #' +
        turno.id +
        ' programado para mañana: ' +
        turno.fechaHora.toLocaleDateString(),
    })

    return notificacion
  }
}
