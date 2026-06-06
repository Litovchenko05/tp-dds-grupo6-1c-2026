import { pacienteSchema } from '../schemas/paciente.schema.js'
export class PacienteController {

  constructor({ pacienteService }) {
    this.pacienteService = pacienteService
  }

  createPaciente = async (req, res) => {
    try{
      const body = req.body
     
      const resultado = pacienteSchema.safeParse(body)

      if (!resultado.success) {
        return res.status(400).json({ status: 'error', data: resultado.error.message })
      }

      const pacienteCreado = await this.pacienteService.createPaciente(resultado.data)

      return res.status(201).json({ status: 'success', data: pacienteCreado})

    }catch(error){
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
      const pacienteId = req.params.pacienteId
      const turnoId = req.params.turnoId

      await this.pacienteService.reservarTurno(pacienteId, turnoId)

      return res.status(200).json({ status: 'success', message: 'Turno reservado exitosamente' })
    } catch (error) {
      return res.status(500).json({ data: error.message })
    }
  }

  consultarHistorial = async (req, res) => {
    try {
      const pacienteId = req.params.pacienteId
      const historial = await this.pacienteService.consultarHistorial(pacienteId)
      return res.status(200).json({ status: 'success', data: historial })
    } catch (error) {
      return res.status(500).json({ data: error.message })
    }
  }

  solicitarCambioDeFecha = async (req, res) => {
    try {
      const pacienteId = req.params.pacienteId
      const turnoId = req.params.turnoId
      const nuevaFecha = req.body.nuevaFecha

      this.pacienteService.solicitarCambioDeFecha(pacienteId, turnoId, nuevaFecha)

      return res.status(200).json({
        status: 'success',
        message: 'Solicitud de cambio de fecha enviada exitosamente, espera la confirmación',
      })
    } catch (error) {
      return res.status(500).json({ data: error.message })
    }
  }

  //GET ALL PAGINADO
    async findAllPaginated(req, res) {
        try {
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || 5
            const resultado =  await this.pacienteService.findAllPaginated(page, limit)
            return res.status(200).json({
            status: 'success',
            data: resultado,
        })
        } catch(error) {
          return res.status(500).json({
          status: 'error',
          message: 'Error interno del servidor',
        })
        }
    }
}
