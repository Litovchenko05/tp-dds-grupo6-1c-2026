import { especialidadSchema } from '../validators/especialidad.schema.js'
import { medicoSchema } from '../validators/medico.schema.js'
import { practicaSchema } from '../validators/practica.schema.js'
import { cancelarTurnoSchema } from '../validators/cancelarTurnoSchema.js'
import { marcarRealizadoSchema } from '../validators/marcarRealizadoSchema.js'
import { agregarServicioSchema } from '../validators/agregarServicioSchema.js'
import { crearCambioSchema } from '../validators/cambioFechaTurnoSchema.js'
import { nuevaDisponibilidadSchema } from '../validators/nuevaDisponibilidad.js'

export class MedicoController {
  constructor({ medicoService, turnoService, pacienteService }) {
    this.medicoService = medicoService
    this.turnoService = turnoService
    this.pacienteService = pacienteService
  }

  createMedico = async (req, res) => {
    try {
      const body = req.body

      const resultado = medicoSchema.safeParse(body)

      if (!resultado.success) {
        return res.status(400).json({ status: 'error', message: resultado.error.message })
      }

      const medicoCreado = await this.medicoService.createMedico(resultado.data)

      return res.status(201).json({ status: 'success', data: medicoCreado })
    } catch (error) {
      return res.status(409).json({ data: error.message })
    }
  }

  findAll = async (req, res) => {
    try {
      const resultado = await this.medicoService.obtenerTodos()

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

      const medico = await this.medicoService.obtenerPorId(id)
      if (!medico) {
        return res.status(404).json({ status: 'error', message: 'Medico no encontrado' })
      }

      return res.status(200).json({ status: 'success', data: medico })
    } catch (error) {
      return res.status(400).json({ data: error })
    }
  }

  createDisponibilidad = async (req, res) => {
    try {
      const { medicoId } = req.params
      const body = req.body
      const resultado = nuevaDisponibilidadSchema.safeParse(body)

      if (!resultado.success) {
        return res.status(400).json({ status: 'error', message: resultado.error.errors })
      }
      const medico = await this.medicoService.agregarDisponibilidad(medicoId, resultado.data)

      return res.status(201).json({ status: 'success', data: medico })
    } catch (error) {
      return res.status(500).json({ data: error.message })
    }
  }

  modificarDisponibilidad = async (req, res) => {
    try {
      const body = req.body
      const resultado = nuevaDisponibilidadSchema.safeParse(body)

      if (!resultado.success) {
        console.log('Error de validación:', resultado.error.errors)
        return res.status(400).json({ status: 'error', message: resultado.error })
      }
      const medicoId = req.params.id
      const servicioId = req.params.servicioId

      const medico = await this.medicoService.modificarDisponibilidad(
        medicoId,
        servicioId,
        resultado.data
      )

      return res.status(200).json({ status: 'success', data: medico })
    } catch (error) {
      return res.status(500).json({ data: error.message })
    }
  }

  obtenerTurnos = async (req, res) => {
    try {
      const { id } = req.params
      const resultado = await this.medicoService.obtenerTurnosMedico(id, req.query)

      return res.status(200).json({
        status: 'success',
        data: resultado.turnos,
        pagination: {
          total: resultado.total,
          page: resultado.page,
          totalPages: resultado.totalPages,
        },
      })
    } catch (error) {
      const statusCode = error.message === 'Médico no encontrado' ? 404 : 400
      return res.status(statusCode).json({ status: 'error', message: error.message })
    }
  }

  obtenerEstadisticas = async (req, res) => {
    try {
      const { id } = req.params
      const estadisticas = await this.medicoService.obtenerEstadisticas(id)

      return res.status(200).json({ status: 'success', data: estadisticas })
    } catch (error) {
      const statusCode = error.message === 'Médico no encontrado' ? 404 : 400
      return res.status(statusCode).json({ status: 'error', message: error.message })
    }
  }

  solicitarCambioFecha = async (req, res) => {
    try {
      const { id } = req.params
      const { idTurno } = req.params
      const { nuevaFechaHora } = req.body
      const resultado = this.medicoService.solicitarCambioDeFecha(id, idTurno, nuevaFechaHora)

      if (!resultado.success) {
        return res.status(400).json({ status: 'error', message: resultado.error.errors })
      }
    } catch (error) {
      if (error.message === 'Turno no encontrado') {
        return res.status(404).json({
          status: 'error',
          message: error.message,
        })
      }
    }
  }
  //GET ALL PAGINADO
  async findAllPaginated(req, res) {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 5
      const resultado = await this.medicoService.findAllPaginated(page, limit)
      return res.status(200).json({
        status: 'success',
        data: resultado,
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message,
      })
    }
  }
  cancelarTurno = async (req, res) => {
    try {
      const { id: medicoId, idTurno: turnoId } = req.params
      const body = req.body

      const resultado = cancelarTurnoSchema.safeParse(body)

      if (!resultado.success) {
        return res.status(400).json({ status: 'error', message: resultado.error.errors })
      }

      const turnoActualizado = await this.turnoService.cancelar(
        turnoId,
        medicoId,
        resultado.data.motivo
      )

      return res.status(200).json({
        status: 'success',
        message: 'Turno cancelado exitosamente',
        data: turnoActualizado,
      })
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({ status: 'error', message: error.message })
      }
      if (error.message.includes('no pertenece')) {
        return res.status(403).json({ status: 'error', message: error.message })
      }
      if (error.message.includes('ya está cancelado')) {
        return res.status(409).json({ status: 'error', message: error.message })
      }
      return res.status(400).json({ status: 'error', message: error.message })
    }
  }

  reactivarTurno = async (req, res) => {
    try {
      const { id: medicoId, idTurno: turnoId } = req.params
      const turnoActualizado = await this.turnoService.reactivarTurno(turnoId, medicoId)
      return res.status(200).json({
        status: 'success',
        message: 'Turno reactivado como disponible',
        data: turnoActualizado,
      })
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({ status: 'error', message: error.message })
      }
      if (error.message.includes('no pertenece')) {
        return res.status(403).json({ status: 'error', message: error.message })
      }
      return res.status(400).json({ status: 'error', message: error.message })
    }
  }

  actualizarTurno = async (req, res) => {
    try {
      const { id: medicoId, idTurno: turnoId } = req.params
      const body = req.body

      const resultado = marcarRealizadoSchema.safeParse(body)

      if (!resultado.success) {
        return res.status(400).json({ status: 'error', message: resultado.error.errors })
      }

      // Si el estado es REALIZADO, llamar al método correspondiente
      if (resultado.data.estado === 'REALIZADO') {
        const turnoActualizado = await this.turnoService.marcarRealizadoTurno(
          turnoId,
          medicoId,
          resultado.data.notas
        )

        return res.status(200).json({
          status: 'success',
          message: 'Turno marcado como realizado',
          data: turnoActualizado,
        })
      }
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({ status: 'error', message: error.message })
      }
      if (error.message.includes('no pertenece')) {
        return res.status(403).json({ status: 'error', message: error.message })
      }
      return res.status(400).json({ status: 'error', message: error.message })
    }
  }

  crearCambio = async (req, res) => {
    try {
      const { id: medicoId, idTurno: turnoId } = req.params
      const body = req.body

      const resultado = crearCambioSchema.safeParse(body)

      if (!resultado.success) {
        return res.status(400).json({ status: 'error', message: resultado.error.errors })
      }

      const turnoActualizado = await this.turnoService.proponerCambioFecha(
        turnoId,
        medicoId,
        resultado.data.nuevaFecha,
        resultado.data.nuevaHora,
        resultado.data.motivo
      )

      return res.status(201).json({
        status: 'success',
        message: 'Solicitud de cambio creada',
        data: turnoActualizado,
      })
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({ status: 'error', message: error.message })
      }
      if (error.message.includes('no pertenece')) {
        return res.status(403).json({ status: 'error', message: error.message })
      }
      return res.status(400).json({ status: 'error', message: error.message })
    }
  }

  obtenerServicios = async (req, res) => {
    try {
      const { medicoId } = req.params

      const servicios = await this.medicoService.obtenerServicios(medicoId)

      return res.status(200).json({
        status: 'success',
        data: servicios,
      })
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({ status: 'error', message: error.message })
      }
      return res.status(400).json({ status: 'error', message: error.message })
    }
  }

  agregarServicio = async (req, res) => {
    try {
      const { medicoId } = req.params
      const body = req.body
      const resultado = agregarServicioSchema.safeParse(body)

      if (!resultado.success) {
        return res.status(400).json({ status: 'error', message: resultado.error.errors })
      }

      const servicioAgregado = await this.medicoService.agregarServicio(medicoId, resultado)

      return res.status(201).json({
        status: 'success',
        message: 'Servicio agregado exitosamente',
        data: servicioAgregado,
      })
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({ status: 'error', message: error.message })
      }
      if (error.message.includes('ya está asociado')) {
        return res.status(409).json({ status: 'error', message: error.message })
      }
      return res.status(400).json({ status: 'error', message: error.message })
    }
  }

  Servicio = async (req, res) => {
    try {
      const { medicoId, servicioId } = req.params

      const medicoActualizado = await this.medicoService.eliminarServicio(medicoId, servicioId)

      return res.status(200).json({
        status: 'success',
        message: 'Servicio remoremovervido exitosamente',
        data: medicoActualizado,
      })
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({ status: 'error', message: error.message })
      }
      return res.status(400).json({ status: 'error', message: error.message })
    }
  }

  obtenerDisponibilidad = async (req, res) => {
    try {
      const { medicoId } = req.params
      const { especialidad, practica } = req.query

      const filtros = {}
      if (especialidad) filtros.especialidad = especialidad
      if (practica) filtros.practica = practica

      const disponibilidad = await this.medicoService.obtenerDisponibilidad(medicoId, filtros)

      return res.status(200).json({
        status: 'success',
        data: disponibilidad,
      })
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({ status: 'error', message: error.message })
      }
      return res.status(400).json({ status: 'error', message: error.message })
    }
  }

  obtenerHistorialPaciente = async (req, res) => {
    try {
      const { idPaciente } = req.params
      const { desde, hasta, estado } = req.query

      const filtros = {}
      if (desde) filtros.desde = desde
      if (hasta) filtros.hasta = hasta
      if (estado) filtros.estado = estado

      const historial = await this.pacienteService.consultarHistorialPaciente(idPaciente)

      return res.status(200).json({
        status: 'success',
        data: historial,
      })
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({ status: 'error', message: error.message })
      }
      return res.status(400).json({ status: 'error', message: error.message })
    }
  }
  modificarServicio = async (req, res) => {
    try {
      const body = req.body

      const medicoId = req.params.id
      const servicioId = req.params.servicioId

      console.log('id servicio recibido en el controller:', servicioId)
      const resultado = await this.medicoService.modificarServicio(medicoId, servicioId, body)
      return res.status(200).json({ status: 'success', data: resultado })
    } catch (error) {
      return res.status(500).json({ data: error.message })
    }
  }

  deleteServicio = async (req, res) => {
    try {
      const medicoId = req.params.id
      const servicioId = req.params.idServicio //especialidad o practica que se quiere eliminar
      const tipo = req.query.tipo

      await this.medicoService.eliminarServicio(medicoId, servicioId, tipo)

      await this.medicoService.eliminarServicio(medicoId, servicioId)

      return res.status(200).json({
        status: 'success',
        data: 'Servicio eliminado correctamente',
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        data: error.message,
      })
    }
  }
}
