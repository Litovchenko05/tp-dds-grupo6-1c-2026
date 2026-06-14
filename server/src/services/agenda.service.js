import { Agenda } from '../models/Agenda.js'
import { EstadoTurno } from '../models/estadoTurno.enum.js'

export class AgendaService {
  constructor({ turnoRepository }) {
    this.turnoRepository = turnoRepository
  }

  //generar turnos mediante un proceso batch
  async generarTurnosParaDisponibilidad(medico, disponibilidad, sede, servicio, tipoDeServicio) {
    const todosLosTurnosGenerados = Agenda.generarTurnos(
      medico,
      disponibilidad,
      sede,
      servicio,
      tipoDeServicio
    ) //acá me llegan todos los turnos con estado DISPONIBLE, para una disponibilidad del médico

    const TAMANIO_BATCH = 10 // Defino que el tamaño del lote a procesar, va a ser de a 10 turnos por vez

    for (let i = 0; i < todosLosTurnosGenerados.length; i += TAMANIO_BATCH) {
      const batch = todosLosTurnosGenerados.slice(i, i + TAMANIO_BATCH)

      await this.turnoRepository.saveMany(batch) //guardo el lote de turnos en el repositorio de turnos
    }
  }

  async cambiarTurnosPorDisponibilidadModificada(
    medico,
    disponibilidadAnterior,
    disponibilidadModificada
  ) {
    try {
      const fechaPosterior = new Date()
      fechaPosterior.setDate(fechaPosterior.getDate() + 1)

      const turnosDelMedicoAModificar = await this.turnoRepository.findByFilters({
        'medico.usuario._id': medico.usuario._id,
        fechaHora: { $gte: fechaPosterior },
        estado: 'disponible',
      })

      for (const turno of turnosDelMedicoAModificar) {
        const nuevaFechaHora = Agenda.obtenerNuevaFechaDelTurno(
          turno.fechaHora,
          disponibilidadAnterior,
          disponibilidadModificada
        )

        turno.fechaHora = nuevaFechaHora

        turno.save()
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  obtenerDisponiblesSegunMedico(medicoId) {
    const turnosTotales = this.turnoRepository.obtenerPorMedicoId(medicoId)
    const turnosFiltrados = turnosTotales.filter((turno) => turno.estado === EstadoTurno.DISPONIBLE)
    return turnosFiltrados
  }

  obtenerDisponiblesSegunServicio(nombreServicio) {
    const turnosTotales = this.turnoRepository.obtenerTodos()
    const turnosFiltrados = turnosTotales.filter(
      (turno) =>
        turno.getNombreServicio() === nombreServicio && turno.estado === EstadoTurno.DISPONIBLE
    )
    return turnosFiltrados
  }

  obtenerDisponiblesSegunMedicoYServicio(medicoId, nombreServicio) {
    const turnosTotales = this.turnoRepository.obtenerPorMedicoId(medicoId)
    const turnosFiltrados = turnosTotales.filter(
      (turno) =>
        turno.getNombreServicio() === nombreServicio && turno.estado === EstadoTurno.DISPONIBLE
    )
    return turnosFiltrados
  }

  obtenerTurnosPorMedico(medicoId) {
    const turnosTotales = this.turnoRepository.obtenerPorMedicoId(medicoId)
    return turnosTotales
  }

  async findAllPaginated(page, limit) {
    return await this.turnoRepository.findAllPaginated(page, limit)
  }
}
