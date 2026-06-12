import express from 'express'
import { notificacionController } from '../config/dependencies.js'

const router = express.Router()

router.route('/:id/leida').put((req, res) => notificacionController.marcarComoLeida(req, res))

router.route('/').post((req, res) => notificacionController.crearNotificacionPrueba(req, res))

export default router
