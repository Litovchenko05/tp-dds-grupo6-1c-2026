export class Practica {
  id
  nombre
  duracionTurnoEnMins
  costo

  constructor(codigo, nombre, duracionTurnoEnMins, costo) {
    this.nombre = nombre
    this.duracionTurnoEnMins = duracionTurnoEnMins
    this.costo = costo
  }
  modificarPractica(id, nombre, duracionTurnoEnMins, costo) {
    this.id = id
    this.nombre = nombre
    this.duracionTurnoEnMins = duracionTurnoEnMins
    this.costo = costo
  }

  getId() {
    return this.id
  }

  getNombre() {
    return this.nombre
  }

  getDuracionTurnoEnMins() {
    return this.duracionTurnoEnMins
  }

  getCosto() {
    return this.costo
  }
}
