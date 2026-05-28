export class Sede {
  #id
  #nombre
  #direccion

  constructor(nombreSede, direccionSede) {
    this.#nombre = nombreSede
    this.#direccion = direccionSede
  }

  getId() {
    return this.#id
  }

  getNombre() {
    return this.#nombre
  }

  getDireccion() {
    return this.#direccion
  }
}
