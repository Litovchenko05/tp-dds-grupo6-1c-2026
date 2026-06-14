export class ObraSocial {
  static nextId = 1
  id
  nombre
  planes

  constructor(nombre, planes) {
    this.nombre = nombre
    this.planes = planes
  }
  getPlanes() {
    return this.planes
  }
}
