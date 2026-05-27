export class ObraSocial {
  static nextId = 1
  #id
  #nombre
  #planes

  constructor(nombre, planes) {
    this.#id = ObraSocial.nextId++ //Esto para autoincrementar
    this.#nombre = nombre
    this.#planes = planes
  }
  getPlanes(){
    return this.#planes
  }
}
