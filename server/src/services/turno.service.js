import { EstadoTurno } from '../models/estadoTurno.enum.js'

export class TurnoService {
  constructor({ turnoRepository, notificacionService }) {
    this.turnoRepository = turnoRepository
    this.servicioNotificacion = notificacionService
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
    const turno = this.turnoRepository.findById(id_turno)
    if (!turno) {
      throw new Error('Turno no encontrado')
    }
    if (turno.estado === EstadoTurno.CANCELADO) {
      throw new Error('El turno ya está cancelado')
    }

    const cancelador = turno.quienModifica(id_usuario)

    if (!cancelador) {
      throw new Error('No tiene permiso para cancelar este turno.')
    }

    const unaHoraEnMs = 60 * 60 * 1000
    const tiempoRestante = new Date(turno.fechaHora).getTime() - Date.now()

    if (tiempoRestante < unaHoraEnMs) {
      throw new Error('Debe cancelar con al menos 1 hora de anticipación')
    }

    turno.actualizarEstado(EstadoTurno.CANCELADO, cancelador._id, motivo)

    this.turnoRepository.save(turno)

    this.servicioNotificacion.generarNotificacion(
      turno.getContraparte(id_usuario),
      cancelador,
      'El turno : ' + turno._id + 'ha sido cancelado. Motivo: ' + motivo
    )
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
    // Validaciones opcionales

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
  async buscarTurnos({
    nombreMedico,
    nombreServicio,
    especialidad,
    practica,
    sede,
    fechaDesde,
    fechaHasta,
    estadoTurno = 'DISPONIBLE',
    page = 1,
    limit = 5,
    sortBy = 'fecha',
    order = 'asc',
  }) {
    const servicioBuscado = nombreServicio || especialidad || practica

    const resultado = await this.turnoRepository.buscarTurnosPaginated({
      nombreMedico,
      nombreServicio: servicioBuscado,
      sede,
      fechaDesde,
      fechaHasta,
      estadoTurno,
      page,
      limit,
      sortBy,
      order,
    })

    return {
      data: resultado,

      pagination: {
        total: resultado.total,
        page: resultado.page,
        limit: resultado.limit,
        totalPages: resultado.totalPages,
        hasNextPage: resultado.page < resultado.totalPages,
        hasPreviousPage: resultado.page > 1,
      },

      sort: {
        sortBy,
        order,
      },
    }
  }
  async buscarTurnos({
    nombreMedico,
    nombreServicio,
    especialidad,
    practica,
    sede,
    fechaDesde,
    fechaHasta,
    estadoTurno = 'DISPONIBLE',
    page = 1,
    limit = 5,
    sortBy = 'fechaHora',
    order = 'asc',
  }) {
    try {
      const servicioBuscado = nombreServicio || especialidad || practica

      const resultado = await this.turnoRepository.buscarTurnosPaginated({
        nombreMedico,
        nombreServicio: servicioBuscado,
        sede,
        fechaDesde,
        fechaHasta,
        estadoTurno,
        page,
        limit,
        sortBy,
        order,
      })

      // Mapear respuesta con información de cobertura
      const turnosConCobertura = resultado.turnos.map((turno) => ({
        ...turno,
        // Placeholder para cálculo de cobertura - se integra con CoberturasService
        cobertura: {
          estado: 'PENDIENTE_CALCULO', // Se calculará con la obra social del paciente
          montoAbonarPaciente: null,
          porcentajeCobertura: null,
          esUrgencia: false,
        },
      }))

      return {
        data: turnosConCobertura,
        pagination: {
          total: resultado.total,
          page: resultado.page,
          limit: resultado.limit,
          totalPages: resultado.totalPages,
          hasNextPage: resultado.page < resultado.totalPages,
          hasPreviousPage: resultado.page > 1,
        },
        sort: {
          sortBy,
          order,
        },
      }
    } catch (error) {
      throw error
    }
  }
}
