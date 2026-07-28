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

  async proponerCambioFecha(turnoId, medicoId, nuevaFecha, nuevaHora, motivo = '') {
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
        throw new Error('Solo se puede proponer cambio de fecha para turnos reservados')
      }

      // Crear solicitud de cambio (se almacena en historialEstados como estado especial)
      const cambioFecha = {
        fechaHoraIngreso: new Date(),
        estado: 'CAMBIO_PROPUESTO',
        usuario: medicoId,
        motivo: motivo || 'Cambio de fecha propuesto por médico',
        fechaProuesta: nuevaFecha,
        horaProuesta: nuevaHora,
        original: {
          fecha: turno.fechaHora,
        },
      }

      // Guardar solicitud
      const turnoActualizado = await this.turnoRepository.update(turnoId, {
        $push: { historialEstados: cambioFecha },
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

  async solicitarCambioDeFecha(idUsuario, idTurno, nuevaFechaHora) {
    const turno = this.turnoRepository.findById(idTurno)
    if (!turno) {
      throw new Error('Turno no encontrado')
    }
    const quienSolicita = turno.quienModifica(idUsuario)
    if (!quienSolicita) {
      throw new Error('No tiene permiso para solicitar cambio de fecha para este turno.')
    }
    const mensaje =
      'Solicitud de cambio de fecha del turno actual' +
      idTurno +
      ' para la nueva fecha: ' +
      nuevaFechaHora
    const destinatario = turno.getContraparte(idUsuario)
    this.servicioNotificacion.generarNotificacion(destinatario, quienSolicita, mensaje)
    return 'Solicitud de cambio de fecha enviada. La respuesta será notificada.'
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
  async findAllPaginated(page, limit) {
    return await this.turnoRepository.findAllPaginated(page, limit)
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
    pacienteId,
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
