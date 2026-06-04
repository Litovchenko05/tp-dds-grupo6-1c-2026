export class Notificacion {
  static ultimoId = 0

  id
  destinatario
  remitente
  mensaje
  fechaHoraCreacion
  fechaHoraLeida
  leida

  constructor({ destinatario, remitente, mensaje }) {
    this.id = Notificacion.ultimoId++
    this.destinatario = destinatario
    this.remitente = remitente
    this.mensaje = mensaje
    this.fechaHoraCreacion = new Date()
    this.fechaHoraLeida = null
    this.leida = false
  }

  marcarComoLeida() {
    this.leida = true
    this.fechaHoraLeida = new Date()
  }

  getId() {
    return this.id
  }

  getDestinatario() {
    return this.destinatario
  }

  getRemitente() {
    return this.remitente
  }

  getMensaje() {
    return this.mensaje
  }

  getFechaHoraCreacion() {
    return this.fechaHoraCreacion
  }

  getFechaHoraLeida() {
    return this.fechaHoraLeida
  }

  getLeida() {
    return this.leida
  }
}
