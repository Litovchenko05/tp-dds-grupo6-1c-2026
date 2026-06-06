import { TurnoRepository } from '../repositories/turno.repository.js'

export class TurnoService {
  constructor() {
    this.turnoRepository = new TurnoRepository()
  }


  async obtenerTodos() {
    const turnos = await this.turnoRepository.findAll()
    return turnos;
  }

  obtenerPorId(id) {
    const turno = this.turnoRepository.findById(id)

    return turno;
  }

  async obtenerTurnosPorProfesional(nombreDeProfesional){
    const turnos = await this.turnoRepository.obtenerTurnosPorProfesional(nombreDeProfesional)
    return turnos;
  }

  async obtenerTurnosPorEspecialidad(nombreDeEspecialidad){
    const turnos = await this.turnoRepository.obtenerTurnosPorEspecialidad(nombreDeEspecialidad)
    return turnos;
  }
  async obtenerTurnosPorPractica(nombreDePractica){
    const turnos = await this.turnoRepository.obtenerTurnosPorPractica(nombreDePractica)
    return turnos;
  }

  async obtenerTurnosPorSede(nombreSede){
    const turnos = await this.turnoRepository.obtenerTurnosPorSede(nombreSede)
    return turnos;
  }
  async obtenerTurnosPorRango(fechaIncial, fechaFinal){
    const turnos = await this.turnoRepository.obtenerTurnosPorRango(fechaIncial, fechaFinal)
    return turnos;
  }
}
