export class Sede {
  #id
  #nombre
  #direccion

  constructor(idSede, nombreSede, direccionSede) {
    this.#id = idSede
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
