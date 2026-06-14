import express from 'express'
import { notificacionController, usuarioController } from '../config/dependencies.js'

const router = express.Router()

router.route('/').post((req, res) =>
  // #swagger.tags = ['Usuarios']
  // #swagger.summary = 'Registrar un nuevo usuario'
  // #swagger.description = 'Da de alta un usuario en el sistema.'
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos de registro del usuario',
        required: true,
        schema: {
          nombreUsuario: 'pedroibarra',
          password: '1234456'
        }
  } */
  usuarioController.crear(req, res)
)

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
