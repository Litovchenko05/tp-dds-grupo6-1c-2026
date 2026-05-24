import { TurnoRepository } from '../repositories/turno.repository.js'
import { Agenda } from '../models/Agenda.js'
import { EstadoTurno } from '../models/estadoTurno.enum.js'

export class AgendaService {
  constructor({ turnoRepository }) {
    this.turnoRepository = turnoRepository
  }
  //generar turnos mediante un proceso batch
  async generarTurnosParaDisponibilidad(medico, disponibilidad) {
    const todosLosTurnosGenerados = Agenda.generarTurnos(medico, disponibilidad) //acá me llegan todos los turnos con estado DISPONIBLE, para una disponibilidad del médico

    const TAMANIO_BATCH = 10 // Defino que el tamaño del lote a procesar, va a ser de a 10 turnos por vez

    for (let i = 0; i < todosLosTurnosGenerados.length; i += TAMANIO_BATCH) {
      const batch = todosLosTurnosGenerados.slice(i, i + TAMANIO_BATCH)

      await this.turnoRepository.save(batch) //guardo el lote de turnos en el repositorio de turnos
    }
  }

  cambiarTurnosPorDisponibilidadModificada(
    medico,
    disponibilidadAnterior,
    disponibilidadModificada
  ) {
    const turnosTotales = this.turnoRepository.obtenerTodos()
    const nuevosTurnosModificados = Agenda.generarTurnos(medico, disponibilidadModificada)
    const fechaActual = new Date()

    turnosTotales.forEach((turno) => {
      if (
        turno.medico.id === medico.id &&
        this.chequearDay(turno, disponibilidadAnterior) &&
        turno.fechaHora > fechaActual &&
        turno.estado === EstadoTurno.DISPONIBLE
      ) {
        this.turnoRepository.delete(turno)
      }

      const nuevoTurnosModificados = Agenda.generarTurnos(medico, disponibilidadModificada)
      this.TurnoRepository.save(nuevoTurnosModificados)
    })
  }

  chequearDay(turno, disponibilidad) {
    if (
      turno.fechaHora.day == disponibilidad.obtenerIndiceDelDiaDeSemana(disponibilidad.diaSemana)
    ) {
      return true
    }
    return false
  }
}
