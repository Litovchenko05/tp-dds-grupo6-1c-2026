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
router
  .route('/:id/notificaciones')
  .get((req, res) => notificacionController.obtenerDeUsuario(req, res))

export default router
