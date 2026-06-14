import express from 'express'
import { notificacionController } from '../config/dependencies.js'

const router = express.Router()

router.route('/:id/leida').put((req, res) =>
  // #swagger.tags = ['Notificaciones']
  // #swagger.summary = 'Marcar una notificación como leída'
  // #swagger.description = 'Actualiza el estado de una notificación a leída y registra la fecha y hora de lectura.'
  /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID de MongoDB de la notificación a actualizar',
        required: true,
        type: 'string',
        example: '6661ee005fedc12a282ac126'
  } */
  notificacionController.marcarComoLeida(req, res)
)

router.route('/').post((req, res) =>
  // #swagger.tags = ['Notificaciones']
  // #swagger.summary = 'Crear una notificación de prueba'
  // #swagger.description = 'Permite forzar la creación de una notificación manualmente (ideal para probar con Postman).'
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos requeridos para generar la notificación',
        required: true,
        schema: {
          destinatario: '6661ee005fedc12a282ac126',
          remitente: '6661ee005fedc12a282ac127',
          mensaje: 'El paciente Juan Pérez ha cancelado el turno de las 16:30hs.'
        }
  } */
  notificacionController.crearNotificacionPrueba(req, res)
)

export default router
