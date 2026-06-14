export class Practica {
  id
  codigo
  nombre
  duracionTurnoEnMins
  costo
 

  constructor(codigo, nombre, duracionTurnoEnMins, costo) {
    this.codigo = codigo
    this.nombre = nombre
    this.duracionTurnoEnMins = duracionTurnoEnMins
    this.costo = costo
  }
  modificarPractica(id,codigo,nombre,duracionTurnoEnMins,costo){
    this.id = id
    this.codigo = codigo
    this.nombre = nombre
    this.duracionTurnoEnMins = duracionTurnoEnMins
    this.costo = costo
  }

  getId() {
    return this.id
  }

  getCodigo() {
    return this.codigo
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
