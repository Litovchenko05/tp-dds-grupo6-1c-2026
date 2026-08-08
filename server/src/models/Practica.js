export class Practica {
  id
  servicio //es el nombre de la práctica
  duracionEnMins
  costo
  sede
  disponibilidad

  constructor(servicio, duracionEnMins, costo, sede) {
    this.servicio = servicio
    this.duracionEnMins = duracionEnMins
    this.costo = costo
    this.sede = sede
    this.disponibilidad = null
  }
  modificarPractica(id, servicio, duracionEnMins, costo) {
    this.id = id
    this.servicio = servicio
    this.duracionEnMins = duracionEnMins
    this.costo = costo
  }

  getId() {
    return this.id
  }

  getServicio() {
    return this.servicio
  }

  getDuracionEnMins() {
    return this.duracionEnMins
  }

  getCosto() {
    return this.costo
  }
}
