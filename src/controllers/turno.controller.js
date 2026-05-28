export class TurnoController {
  constructor({ turnoService }) {
    this.turnoService = turnoService
  }

  findAll = async (req, res) => {
    try {
      const resultado = await this.turnoService.obtenerTodos()

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

      const turno = this.turnoService.obtenerPorId(id)

      if (!turno) {
        return res.status(404).json({ status: 'error', message: 'Turno no encontrado' })
      }

      return res.status(200).json({ status: 'success', data: turno })
    } catch (error) {
      return res.status(400).json({ data: error.message })
    }
  }

  cancelarTurno = async (req, res) => {
    try {
      const { id } = req.params
      const { motivo, idUsuario } = req.body
      const resultado = this.turnoService.cancelarTurno({
        id,
        idUsuario,
        motivo
      })


      return res.status(200).json({
        status: 'success',
        data: resultado,
        message: 'Turno cancelado exitosamente'
      })

    } catch (error) {
      const status = error.message.includes('no encontrado') ? 404
        : error.message.includes('anticipación') ? 400
        : 500

      return res.status(status).json({
        status: 'error',
        message: error.message
      })
    }
  }

  marcarTurnoComoRealizado = async (req, res) => {
    try {
      const { id } = req.params
      const resultado = this.turnoService.marcarTurnoComoRealizado(id)

      return res.status(200).json({
        status: 'success',
        data: resultado,
        message: 'Turno marcado como realizado exitosamente'
      })
    } catch (error) {
      const status = error.message.includes('no encontrado') ? 404
        : error.message.includes('no tiene permiso') ? 403
        : error.message.includes('solo se pueden marcar como realizado un turno confirmado') ? 409
        : 500

      return res.status(status).json({
        status: 'error',
        message: error.message
      })
    }
  }

  solicitarCambioDeFecha = async (req, res) => {
    try {
      const { id } = req.params
      const { nuevaFechaHora, idUsuario } = req.body
      const resultado = this.turnoService.solicitarCambioDeFecha(idUsuario, id, nuevaFechaHora)

      return res.status(200).json({
        status: 'success',
        data: resultado,
        message: 'Solicitud de cambio de fecha enviada exitosamente'
      })
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: error.message
      })
    }
  }
}
