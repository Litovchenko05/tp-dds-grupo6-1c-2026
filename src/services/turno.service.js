import { TurnoRepository } from '../repositories/turno.repository.js'
import { EstadoTurno } from '../models/estadoTurno.enum.js'

export class TurnoService {
  constructor() {
    this.turnoRepository = new TurnoRepository()
  }

  async obtenerTodos() {
    return await this.turnoRepository.findAll()
  }

  async obtenerPorId(id) {
    return await this.turnoRepository.findById(id)
  }

  async cancelarTurno(turnoId, medicoId, motivo) {
    try {
      const turno = await this.turnoRepository.findById(turnoId)

      if (!turno) {
        throw new Error('Turno no encontrado')
      }

      // Validar que el turno pertenece al médico
      if (turno.medico._id.toString() !== medicoId) {
        throw new Error('Este turno no pertenece al médico')
      }

      // Validar que el turno no esté ya cancelado
      if (turno.estado === EstadoTurno.CANCELADO) {
        throw new Error('El turno ya está cancelado')
      }

      // Validar que el turno esté en estado DISPONIBLE o RESERVADO
      if (turno.estado !== EstadoTurno.DISPONIBLE && turno.estado !== EstadoTurno.RESERVADO) {
        throw new Error(`No se puede cancelar un turno en estado ${turno.estado}`)
      }

      // Crear registro de cambio de estado
      const cambioEstado = {
        fechaHoraIngreso: new Date(),
        estado: EstadoTurno.CANCELADO,
        usuario: medicoId,
        motivo: motivo || 'Sin motivo especificado',
      }

      // Actualizar turno
      const turnoActualizado = await this.turnoRepository.update(turnoId, {
        estado: EstadoTurno.CANCELADO,
        $push: { historialEstados: cambioEstado },
      })

      return turnoActualizado
    } catch (error) {
      throw error
    }
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

