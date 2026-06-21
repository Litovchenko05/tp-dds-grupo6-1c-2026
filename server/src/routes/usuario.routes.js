import express from 'express'
import { notificacionController } from '../config/dependencies.js'

const router = express.Router()

router.route('/:id/notificaciones').get((req, res) =>
  // #swagger.tags = ['Notificaciones']
  // #swagger.summary = 'Obtener notificaciones de un usuario'
  // #swagger.description = 'Recupera el historial de notificaciones (tanto leídas como no leídas) asociadas a un usuario específico.'
  /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID de MongoDB del usuario cuyas notificaciones se quieren consultar',
        required: true,
        type: 'string',
        example: '6661ee005fedc12a282ac126'
  } */
  /* #swagger.parameters['leida'] = {
        in: 'query',
        description: 'Filtrar por notificaciones leídas (true) o no leídas (false). Si no se envía, trae todas.',
        required: false,
        type: 'boolean'
  } */
  notificacionController.obtenerDeUsuario(req, res)
)

export default router
