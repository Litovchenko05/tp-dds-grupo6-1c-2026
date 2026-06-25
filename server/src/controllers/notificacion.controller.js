import { notificacionSchema } from '../validators/notificacion.schema.js'

export class NotificacionController {
  constructor({ notificacionService }) {
    this.notificacionService = notificacionService
  }

  obtenerDeUsuario = async (req, res) => {
    try {
      const { leida } = req.query
      const idUsuario = req.usuarioMongoId

      if (leida !== undefined && leida !== 'true' && leida !== 'false') {
        return res
          .status(400)
          .json({ status: 'error', message: "Parámetro 'leida' inválido. Use 'true' o 'false'." })
      }

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

  crearNotificacionPrueba = async (req, res) => {
    try {
      const resultado = notificacionSchema.safeParse(req.body)

      if (!resultado.success) {
        return res.status(400).json({ status: 'error', data: resultado.error.message })
      }

      const { destinatarioId, remitenteId, mensaje } = resultado.data

      const notificacion = await this.notificacionService.crearNotificacion({
        destinatarioId: destinatarioId,
        remitenteId: remitenteId,
        mensaje: mensaje,
      })

      return res.status(200).json({
        status: 'success',
        data: notificacion,
      })
    } catch (error) {
      return res.status(400).json({
        data: error,
      })
    }
  }
}
