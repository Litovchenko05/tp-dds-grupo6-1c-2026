export class Practica {
  id
  servicio //es el nombre de la práctica
  duracionTurnoEnMins
  costo

  constructor(servicio, duracionTurnoEnMins, costo) {
    this.servicio = servicio
    this.duracionTurnoEnMins = duracionTurnoEnMins
    this.costo = costo
  }
  modificarPractica(id, servicio, duracionTurnoEnMins, costo) {
    this.id = id
    this.servicio = servicio
    this.duracionTurnoEnMins = duracionTurnoEnMins
    this.costo = costo
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
    return this.costo
  }
}
