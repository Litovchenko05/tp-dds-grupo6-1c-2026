import { Agenda } from '../models/Agenda.js'
import { EstadoTurno } from '../models/EstadoTurno.enum.js'

export class AgendaService {
  constructor({ turnoRepository }) {
    this.turnoRepository = turnoRepository
  }

  //generar turnos mediante un proceso batch
  async generarTurnosParaDisponibilidad(
    medicoId,
    disponibilidad,
    sedeId,
    servicioId,
    tipoDeServicio,
    duracion,
    costo
  ) {
    const todosLosTurnosGenerados = Agenda.generarTurnos(
      medicoId,
      disponibilidad,
      sedeId,
      servicioId,
      tipoDeServicio,
      duracion,
      costo
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
    disponibilidadModificada,
    duracion,
    sedeId,
    servicioId,
    tipoDeServicio,
    costo
  ) {
    try {
      const fechaActual = new Date()

      const turnosDelMedicoAModificar = await this.turnoRepository.findByFilters({
        medico: medico._id,
        fechaHora: { $gte: fechaActual },
        estado: EstadoTurno.DISPONIBLE,
        $expr: {
          $eq: [
            { $dayOfWeek: '$fechaHora' },
            disponibilidadAnterior.obtenerIndiceDelDiaDeSemana(
              disponibilidadAnterior.getDiaSemana()
            ) + 1,
          ],
        },
      })
      // console.log("Turnos encontrados:", turnosDelMedicoAModificar.length);
      // console.log("medico buscado:", medico._id);
      // console.log("día buscado:", disponibilidadAnterior.getDiaSemana());
      // console.log(
      //   "índice día:",
      //   disponibilidadAnterior.obtenerIndiceDelDiaDeSemana(
      //     disponibilidadAnterior.getDiaSemana()
      //   )
      // );

      if (
        duracion == undefined &&
        sedeId == undefined &&
        servicioId == undefined &&
        tipoDeServicio == undefined &&
        costo == undefined &&
        disponibilidadAnterior.horaDesde == disponibilidadModificada.horaDesde &&
        disponibilidadAnterior.horaHasta == disponibilidadModificada.horaHasta &&
        disponibilidadModificada.diaSemana != disponibilidadAnterior.diaSemana
      ) {
        for (const turno of turnosDelMedicoAModificar) {
          const nuevaFechaHora = Agenda.obtenerNuevaFechaDelTurno(
            turno.fechaHora,
            disponibilidadAnterior,
            disponibilidadModificada
          )

          turno.fechaHora = nuevaFechaHora

          await this.turnoRepository.save(turno)
        }
      } else {
        if (turnosDelMedicoAModificar.length != 0) {
          if (sedeId == undefined) {
            sedeId = turnosDelMedicoAModificar[0].sede._id
          }
          if (servicioId == undefined) {
            servicioId = turnosDelMedicoAModificar[0].servicio._id
          }
          if (tipoDeServicio == undefined) {
            tipoDeServicio = turnosDelMedicoAModificar[0].tipoDeServicio
          }
          if (duracion == undefined) {
            duracion = turnosDelMedicoAModificar[0].duracion
          }
          if (costo == undefined) {
            costo = turnosDelMedicoAModificar[0].costo
          }

          for (const turno of turnosDelMedicoAModificar) {
            await this.turnoRepository.delete(turno._id)
          }

          await this.generarTurnosParaDisponibilidad(
            medico._id,
            disponibilidadModificada,
            sedeId,
            servicioId,
            tipoDeServicio,
            duracion,
            costo
          )
        }
      }
    } catch (error) {
      // console.error(error);
      throw error
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
