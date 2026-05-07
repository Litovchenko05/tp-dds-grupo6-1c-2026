import express from "express"
import { NotificacionController } from '../controllers/notificacion.controller.js'
import { NotificacionService } from '../services/notificacion.service.js'
import { notificacionRepository } from '../repositories/datosPrueba.enMemoria.js'

const notificacionService = new NotificacionService({ notificacionRepository: notificacionRepository })
const notificacionController = new NotificacionController({ notificacionService: notificacionService })

const router = express.Router()

router.route('/')
	.get((req, res) => notificacionController.findAll(req, res))

export default router