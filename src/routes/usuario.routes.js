import express from 'express'
import { notificacionController, usuarioController } from '../config/dependencies.js'

const router = express.Router()

router.route('/').post((req, res) => usuarioController.crear(req, res))

router
  .route('/:id/notificaciones')
  .get((req, res) => notificacionController.obtenerDeUsuario(req, res))

export default router
