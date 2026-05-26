import { especialidadSchema } from '../schemas/especialidad.schema.js'

export class Especialidad {
  #id
  #nombre
  #duracionTurnoEnMins
  #costoConsulta

  constructor(id, nombre, duracionTurnoEnMins, costoConsulta) {
    this.#id = id
    this.#nombre = nombre
    this.#duracionTurnoEnMins = duracionTurnoEnMins
    this.#costoConsulta = costoConsulta
  }

  getId() {
    return this.#id
  }

  getNombre() {
    return this.#nombre
  }

  getDuracionTurnoEnMins() {
    return this.#duracionTurnoEnMins
  }

  getCostoConsulta() {
    return this.#costoConsulta
  }

  getCosto() {
    return this.#costoConsulta // para usar servicio y practica de forma polimorfica en turno
  }
}
