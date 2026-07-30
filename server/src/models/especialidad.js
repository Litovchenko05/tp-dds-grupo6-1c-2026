export class Especialidad {
  id
  servicio //nombre de la especialidad
  duracionTurnoEnMins
  costoConsulta

  constructor(servicio, duracionTurnoEnMins, costoConsulta) {
    this.servicio = servicio
    this.duracionTurnoEnMins = duracionTurnoEnMins
    this.costoConsulta = costoConsulta
  }
  modificarEspecialidad(id, servicio, duracionTurnoEnMins, costoConsulta) {
    this.id = id
    this.servicio = servicio
    this.duracionTurnoEnMins = duracionTurnoEnMins
    this.costoConsulta = costoConsulta
  }

  getId() {
    return this.id
  }

  getServicio() {
    return this.servicio
  }

  getDuracionTurnoEnMins() {
    return this.duracionTurnoEnMins
  }

  getCosto() {
    return this.costoConsulta
  }

  getCosto() {
    return this.costoConsulta // para usar servicio y practica de forma polimorfica en turno
  }
}
