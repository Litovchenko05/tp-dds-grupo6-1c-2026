import { EstadoTurno } from '../models/estadoTurno.enum.js'
import { Types } from 'mongoose'
import { formatearFechaHora } from '../config/utils.js'

export class PacienteService {
  constructor({
    pacienteRepository,
    turnoRepository,
    medicoRepository,
    turnoService,
    notificacionService,
  }) {
    this.pacienteRepository = pacienteRepository
    this.turnoRepository = turnoRepository
    this.medicoRepository = medicoRepository
    this.turnoService = turnoService
    this.notificacionService = notificacionService
  }

  async createPaciente(pacienteData) {
    const { usuario, dni, nombre } = pacienteData

    if (!usuario || !dni || !nombre) {
      throw new Error('Todos los campos son requeridos')
    }

    const existente = await this.pacienteRepository.findByDni(pacienteData.dni)

    if (existente) {
      throw new Error('El Paciente ya existe')
    }

    const nuevoPaciente = { dni, nombre, usuario }

    const pacienteGuardado = await this.pacienteRepository.save(nuevoPaciente)

    return pacienteGuardado
  }

  async obtenerTodos() {
    const pacientes = await this.pacienteRepository.findAll()

    return pacientes
  }

  async obtenerPorId(id) {
    const paciente = await this.pacienteRepository.findById(id)

    return paciente
  }

  async reservarTurno(usuarioId, turnoId) {
    const paciente = await this.pacienteRepository.findOne({
      usuario: new Types.ObjectId(usuarioId),
    })

    if (!paciente) {
      throw new Error('Paciente no encontrado')
    }

    const turno = await this.turnoRepository.findById(new Types.ObjectId(turnoId))

    if (!turno) {
      throw new Error('Turno no encontrado')
    }

    if (turno.estado == EstadoTurno.DISPONIBLE) {
      turno.paciente = paciente._id
      // turno.estado = EstadoTurno.RESERVADO
      turno.actualizarEstado(EstadoTurno.RESERVADO, usuarioId, 'Reservación de turno')
      await this.turnoRepository.save(turno)

      paciente.turnos.push(turno._id)
      await this.pacienteRepository.save(paciente)
      const { fecha, hora } = formatearFechaHora(turno.fechaHora)
      await this.notificacionService.crearNotificacion({
        destinatarioId: turno.medico.usuario,
        mensaje: `El paciente ${paciente.nombre} ha reservado un turno para la ${turno.tipoDeServicio}: ${turno.servicio.nombre} el día ${fecha} a las ${hora} hs`,
      })

      return turno
    } else {
      throw new Error('El turno no está disponible para reservar')
    }
  }

  async cancelarTurno(pacienteId, turnoId, motivo) {
    try {
      const paciente = await this.pacienteRepository.findById(pacienteId)

      if (!paciente) {
        throw new Error('Paciente no encontrado')
      }

      const turnoCancelado = await this.turnoService.cancelar(turnoId, paciente.usuario._id, motivo)

      return turnoCancelado
    } catch (error) {
      throw error
    }
  }

  async consultarHistorial(usuarioId) {
    const paciente = await this.pacienteRepository.findByUsuario(usuarioId)
    if (!paciente) {
      throw new Error('Paciente no encontrado')
    }
    const historial = paciente.historialDeTurnos

    const turnosDeHistorial = await Promise.all(
      historial.map((t) => this.turnoRepository.findById(t._id))
    )

    return turnosDeHistorial
  }

  async findAllPaginated(page, limit) {
    return await this.pacienteRepository.findAllPaginated(page, limit)
  }

  async obtenerCoberturaMedica(id) {
    return await this.pacienteRepository.findByIdWithCobertura(id)
  }

  async definirCoberturaMedica(id, obraSocialId, planId) {
    const paciente = await this.pacienteRepository.findById(id)

    if (!paciente) {
      throw new Error('Paciente no encontrado')
    }

    paciente.obraSocial = obraSocialId ? new Types.ObjectId(obraSocialId) : null
    paciente.plan = planId ? new Types.ObjectId(planId) : null

    return await this.pacienteRepository.save(paciente)
  }
}
