export class Especialidad {
  id
  nombre
  duracionTurnoEnMins
  costoConsulta

  constructor(nombre, duracionTurnoEnMins, costoConsulta) {
    this.nombre = nombre
    this.duracionTurnoEnMins = duracionTurnoEnMins
    this.costoConsulta = costoConsulta
  }
  modificarEspecialidad(id, nombre, duracionTurnoEnMins, costoConsulta) {
    this.id = id
    this.nombre = nombre
    this.duracionTurnoEnMins = duracionTurnoEnMins
    this.costoConsulta = costoConsulta
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
    return this.costoConsulta
  }

  getCosto() {
    return this.costoConsulta // para usar servicio y practica de forma polimorfica en turno
  }
}
