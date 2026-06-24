import express from 'express'
import { notificacionController } from '../config/dependencies.js'
import { identificarUsuario } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.route('/').get(identificarUsuario, (req, res) =>
  // #swagger.tags = ['Notificaciones']
  // #swagger.summary = 'Obtener notificaciones'
  // #swagger.description = 'Recupera el historial de notificaciones del usuario autenticado (extraído del token JWT).'
  /* #swagger.parameters['leida'] = {
        in: 'query',
        description: 'Filtrar por notificaciones leídas (true) o no leídas (false). Si no se envía, trae todas.',
        required: false,
        type: 'boolean'
  } */
  notificacionController.obtenerDeUsuario(req, res)
)

router.route('/:id/leida').put(identificarUsuario, (req, res) =>
  // #swagger.tags = ['Notificaciones']
  // #swagger.summary = 'Marcar una notificación como leída'
  // #swagger.description = 'Actualiza el estado de una notificación a leída y registra la fecha y hora de lectura.'
  /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID de MongoDB de la notificación a actualizar',
        required: true,
        type: 'string'
  } */
  notificacionController.marcarComoLeida(req, res)
)

router.route('/prueba').post((req, res) =>
  // #swagger.tags = ['Notificaciones']
  // #swagger.summary = 'Crear una notificación de prueba'
  notificacionController.crearNotificacionPrueba(req, res)
)

export default router
