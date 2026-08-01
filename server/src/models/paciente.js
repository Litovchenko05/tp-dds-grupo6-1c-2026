export class Paciente {
  id
  usuario
  dni
  nombre
  obraSocial
  plan
  turnos
  historialDeTurnos

  constructor(usuario, dni, nombre, obraSocial, plan) {
    this.usuario = usuario
    this.dni = dni
    this.nombre = nombre
    this.obraSocial = obraSocial
    this.plan = plan
    this.turnos = []
    this.historialDeTurnos = []
  }

  getId() {
    return this.id
  }

  getUsuario() {
    return this.usuario
  }

  getDni() {
    return this.dni
  }

  getNombre() {
    return this.nombre
  }

  getObraSocial() {
    return this.obraSocial
  }

  getPlan() {
    return this.plan
  }

  getHistorialDeTurnos() {
    return this.historialDeTurnos
  }

  getTurnos() {
    return this.turnos
  }

  guardarTurnoEnTurnos(turno) {
    this.turnos.push(turno)
  }

  guardarTurnoEnHistorial(turno) {
    this.historialDeTurnos.push(turno)
  }
}
