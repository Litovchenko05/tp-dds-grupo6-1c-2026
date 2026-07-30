import { EstadoTurno } from '../models/estadoTurno.enum.js'

export class TurnoService {
  constructor({ turnoRepository, notificacionService }) {
    this.turnoRepository = turnoRepository
    this.servicioNotificacion = notificacionService
  }

  async obtenerTurnosReservados(id) {
    return await this.turnoRepository.findByUsuario(id)
  }
  async obtenerTodos() {
    return await this.turnoRepository.findAll()
  }

  async obtenerPorId(id) {
    return await this.turnoRepository.findById(id)
  }

  async marcarRealizadoTurno(turnoId, medicoId, notas = '') {
    try {
      const turno = await this.turnoRepository.findById(turnoId)

      if (!turno) {
        throw new Error('Turno no encontrado')
      }

      // Validar que el turno pertenece al médico
      if (turno.medico._id.toString() !== medicoId) {
        throw new Error('Este turno no pertenece al médico')
      }

      // Validar que el turno está en estado RESERVADO
      if (turno.estado !== EstadoTurno.RESERVADO) {
        throw new Error(`No se puede marcar como realizado un turno en estado ${turno.estado}`)
      }

      // Crear registro de cambio de estado
      const cambioEstado = {
        fechaHoraIngreso: new Date(),
        estado: EstadoTurno.REALIZADO,
        usuario: medicoId,
        motivo: notas || 'Turno realizado',
      }

      // Actualizar turno
      const turnoActualizado = await this.turnoRepository.update(turnoId, {
        estado: EstadoTurno.REALIZADO,
        $push: { historialEstados: cambioEstado },
      })

      return turnoActualizado
    } catch (error) {
      throw error
    }
  }

  async cancelar(id_turno, id_usuario, motivo) {
    const turno = await this.turnoRepository.findById(id_turno)
    if (!turno) {
      throw new Error('Turno no encontrado')
    }
    if (turno.estado === EstadoTurno.CANCELADO) {
      throw new Error('El turno ya está cancelado')
    }

    // const cancelador = turno.quienModifica(id_usuario)

    // if (!cancelador) {
    //   throw new Error('No tiene permiso para cancelar este turno.')
    // }

    const unaHoraEnMs = 60 * 60 * 1000
    const tiempoRestante = new Date(turno.fechaHora).getTime() - Date.now()

    if (tiempoRestante < unaHoraEnMs) {
      throw new Error('Debe cancelar con al menos 1 hora de anticipación')
    }

    turno.actualizarEstado(EstadoTurno.CANCELADO, id_usuario, motivo)

    await this.turnoRepository.save(turno)
    await this.turnoRepository.actualizarHistoral(turno, id_usuario)

    // this.servicioNotificacion.generarNotificacion(
    //   turno.getContraparte(id_usuario),
    //   id_usuario,
    //   'El turno : ' + turno._id + 'ha sido cancelado. Motivo: ' + motivo
    // )
    return turno
  }

  marcarComoRealizado(id_turno, id_usuario) {
    if (turno.estado === 'realizado') {
      return turno
    }
    const turno = this.turnoRepository.findBYiD(id_turno)
    if (!turno) {
      throw new Error('Turno no encontrado')
    }

    if (turno.medico.id !== id_usuario) {
      throw new Error('Solo el médico puede marcar el turno como realizado')
    }

    if (turno.estado !== 'confirmado') {
      throw new Error('Solo se puede marcar como realizado un turno confirmado')
    }

    turno.actualizarEstado(EstadoTurno.REALIZADO, turno.medico, 'El turno ha sido realizado')
    this.turnoRepository.guardar(turno)
    return turno
  }

  obtenerHistorial(id_usuario) {
    let turnos = this.turnoRepository.obtenerPorUsuario(id_usuario)
    let turnosFiltrados = turnos.filter((t) => t.estado === EstadoTurno.REALIZADO)
    return turnosFiltrados
  }

  //paginado
  async findAllPaginated(idUsuario, page, limit, sortBy, order) {
    return await this.turnoRepository.findAllPaginated(idUsuario, page, limit, sortBy, order)
  }

  async findAllFilteredPaginated({
    idUsuario,
    nombreMedico,
    idServicio,
    idSede,
    fechaDesde,
    fechaHasta,
    tipoServicio,
    page,
    limit,
    sortBy,
    order,
  }) {
    if (page && page < 1) {
      throw new Error('El número de página debe ser mayor que 0')
    }

    if (limit && limit < 1) {
      throw new Error('El límite debe ser mayor que 0')
    }

    if (fechaDesde && fechaHasta && new Date(fechaDesde) > new Date(fechaHasta)) {
      throw new Error('La fecha desde no puede ser mayor que la fecha hasta')
    }

    return await this.turnoRepository.findAllFilteredPaginated({
      idUsuario,
      nombreMedico,
      idServicio,
      idSede,
      fechaDesde,
      fechaHasta,
      tipoServicio,
      page,
      limit,
      sortBy,
      order,
    })
  }

  async obtenerTodosLosServicios(page, limit, especialidadId, practicaId) {
    return await this.turnoRepository.buscarServiciosPaginados(
      page,
      limit,
      especialidadId,
      practicaId
    )
  }
}
