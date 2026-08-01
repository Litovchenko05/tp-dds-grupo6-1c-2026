import { EstadoTurno } from '../models/estadoTurno.enum.js'
import { pacienteSchema } from '../validators/paciente.schema.js'
import { nuevoEstadoTurno } from '../validators/nuevoEstadoTurnoSchema.js'
export class PacienteController {
  constructor({ pacienteService }) {
    this.pacienteService = pacienteService
  }

  createPaciente = async (req, res) => {
    try {
      const body = req.body

      const resultado = pacienteSchema.safeParse(body)

      if (!resultado.success) {
        return res.status(400).json({ status: 'error', data: resultado.error.message })
      }

      const pacienteCreado = await this.pacienteService.createPaciente(resultado.data)

      return res.status(201).json({ status: 'success', data: pacienteCreado })
    } catch (error) {
      return res.status(409).json({ data: error.message })
    }
  }

  findAll = async (req, res) => {
    try {
      const resultado = await this.pacienteService.obtenerTodos()

      return res.status(200).json({
        status: 'success',
        data: resultado,
      })
    } catch (error) {
      return res.status(400).json({
        data: error.message,
      })
    }
  }

  findById = async (req, res) => {
    try {
      const { id } = req.params

      const paciente = await this.pacienteService.obtenerPorId(id)
      if (!paciente) {
        return res.status(404).json({ status: 'error', message: 'Paciente no encontrado' })
      }

      return res.status(200).json({ status: 'success', data: paciente })
    } catch (error) {
      return res.status(400).json({ data: error.message })
    }
  }

  reservarTurno = async (req, res) => {
    try {
      const usuarioId = req.params.idUsuario
      const turnoId = req.params.idTurno

      const turnoReservado = await this.pacienteService.reservarTurno(usuarioId, turnoId)

      return res.status(200).json({ status: 'success', data: turnoReservado })
    } catch (error) {
      const status = error.message.includes('no encontrado') ? 404 : 409
      return res.status(status).json({ data: error.message })
    }
  }

  cambiarEstadoDeTurno = async (req, res) => {
    try {
      const { pacienteId, turnoId } = req.params
      const body = req.body
      const resultado = nuevoEstadoTurno.safeParse(body)
      const turnoModificado = null

      if (resultado.nuevoEstado == EstadoTurno.RESERVADO) {
        turnoModificado = this.pacienteService.reservarTurno(pacienteId, turnoId)
      } else if (resultado.nuevoEstado == EstadoTurno.CANCELADO) {
        turnoModificado = this.pacienteService.cancelarTurno(pacienteId, turnoId, resultado.motivo)
      }

      return res.status(200).json({ status: 'success', data: turnoModificado })
    } catch (error) {
      return res.status(404).json({ data: error.message })
    }
  }

  consultarHistorial = async (req, res) => {
    try {
      const usuarioId = req.params.id
      const historial = await this.pacienteService.consultarHistorial(usuarioId)
      return res.status(200).json({ status: 'success', data: historial })
    } catch (error) {
      return res.status(400).json({ data: error.message })
    }
  }

  //GET ALL PAGINADO
  async findAllPaginated(req, res) {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 5
      const resultado = await this.pacienteService.findAllPaginated(page, limit)
      return res.status(200).json({
        status: 'success',
        data: resultado,
      })
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    }
  }
}
