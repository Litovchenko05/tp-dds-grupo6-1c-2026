export class NotificacionController {
  constructor({ notificacionService }) {
    this.notificacionService = notificacionService
  }

  obtenerDeUsuario = async (req, res) => {
    try {
      const { leida } = req.query
      const idUsuario = req.params.id

      let filtro = null
      if (leida === 'true') filtro = true
      if (leida === 'false') filtro = false

      const resultado = await this.notificacionService.obtenerDeUsuario(idUsuario, filtro)

      return res.status(200).json({
        status: 'success',
        data: resultado,
      })
    } catch (error) {
      return res.status(400).json({
        data: error,
      })
    }
  }

  marcarComoLeida = async (req, res) => {
    try {
      const { id } = req.params

      const resultado = await this.notificacionService.marcarComoLeida(id)

      if (!resultado) {
        return res.status(404).json({
          status: 'error',
          message: 'Notificacion no encontrada',
        })
      }

      return res.status(200).json({
        status: 'success',
        data: resultado,
      })
    } catch (error) {
      return res.status(400).json({
        data: error,
      })
    }
  }
}
