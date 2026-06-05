import express from 'express'
import { NotificacionController } from '../controllers/notificacion.controller.js'
import { NotificacionService } from '../services/notificacion.service.js'
import { NotificacionRepository } from '../repositories/notificacion.repository.js'

const notificacionRepository = new NotificacionRepository()
const notificacionService = new NotificacionService({
  notificacionRepository: notificacionRepository,
})
const notificacionController = new NotificacionController({
  notificacionService: notificacionService,
})

const router = express.Router()

router.route('/:id/leida').put((req, res) => notificacionController.marcarComoLeida(req, res))

router.route('/').post((req, res) => notificacionController.crearNotificacionPrueba(req, res))

export default router
