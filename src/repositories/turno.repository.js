export class TurnoRepository {
  #turnos

  constructor(datosIniciales = []) {
    this.#turnos = []
    this.cargar(datosIniciales)
  }

  guardar(turno) {
    if (!turno || turno.id == null) {
      throw new Error('El turno debe tener un id para guardarse en memoria')
    }

    const indiceExistente = this.#turnos.findIndex((t) => t.id === turno.id)

    if (indiceExistente >= 0) {
      this.#turnos[indiceExistente] = turno
    } else {
      this.#turnos.push(turno)
    }

    return turno
  }

  obtenerTodos() {
    return [...this.#turnos]
  }

  obtenerPorId(idTurno) {
    return this.#turnos.find((turno) => turno.id === idTurno) ?? null
  }

  obtenerPorMedicoId(idMedico) {
    return this.#turnos.filter((turno) => turno.medico?.id === idMedico)
  }

  eliminarPorId(idTurno) {
    const cantidadInicial = this.#turnos.length
    this.#turnos = this.#turnos.filter((turno) => turno.id !== idTurno)
    return this.#turnos.length < cantidadInicial
  }

  limpiar() {
    this.#turnos = []
  }

  cargar(turnos = []) {
    turnos.forEach((turno) => this.guardar(turno))
  }

  save(turnosNuevos) {
    this.#turnos.push(...turnosNuevos)
  }

  delete(turno) {
    const indice = this.#turnos.indexOf(turno)

    if (indice !== -1) {
      this.#turnos.splice(indice, 1)
    }
  }
}
