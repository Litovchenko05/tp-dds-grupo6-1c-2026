export class NotificacionController {
  constructor({ notificacionService }) {
    this.notificacionService = notificacionService
  }

  findAll = async (req, res) => {
    try {
      const { leida } = req.query

      let filtro = null
      if (leida === 'true') filtro = true
      if (leida === 'false') filtro = false

      const resultado = this.notificacionService.obtenerTodas(filtro)

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
