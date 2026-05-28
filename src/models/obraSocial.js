export class ObraSocial {
  static nextId = 1
  #id
  #nombre
  #planes

  constructor(id,nombre, planes) {
    this.#id = id;
    this.#nombre = nombre
    this.#planes = planes
  }
  getPlanes(){
    return this.#planes
  }
}
