export class Practica {
  id
  codigo
  servicio //es el nombre de la práctica
  duracionTurnoEnMins
  costo
 

  constructor(codigo, servicio, duracionTurnoEnMins, costo) {
    this.codigo = codigo
    this.servicio = servicio
    this.duracionTurnoEnMins = duracionTurnoEnMins
    this.costo = costo
  }
  modificarPractica(id,codigo,servicio,duracionTurnoEnMins,costo){
    this.id = id
    this.codigo = codigo
    this.servicio = servicio
    this.duracionTurnoEnMins = duracionTurnoEnMins
    this.costo = costo
  }

  getId() {
    return this.id
  }

  getCodigo() {
    return this.codigo
  }

  getServicio() {
    return this.servicio
  }

  getDuracionTurnoEnMins() {
    return this.duracionTurnoEnMins
  }

  getCosto() {
    return this.costo
  }
}
