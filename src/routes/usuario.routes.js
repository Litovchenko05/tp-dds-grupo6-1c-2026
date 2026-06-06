import express from 'express'
import { NotificacionController } from '../controllers/notificacion.controller.js'
import { NotificacionService } from '../services/notificacion.service.js'
import { NotificacionRepository } from '../repositories/notificacion.repository.js'
import { UsuarioController } from '../controllers/usuario.controller.js'
import { UsuarioRepository } from '../repositories/usuario.repository.js'
import { UsuarioService } from '../services/usuario.service.js'

const notificacionRepository = new NotificacionRepository()
const notificacionService = new NotificacionService({
  notificacionRepository: notificacionRepository,
})
const usuarioRepository = new UsuarioRepository()
const usuarioService = new UsuarioService({ usuarioRepository: usuarioRepository })
const notificacionController = new NotificacionController({
  notificacionService: notificacionService,
})
const usuarioController = new UsuarioController({ usuarioService: usuarioService })

const router = express.Router()

router.route('/').post((req, res) => usuarioController.crear(req, res))

router
  .route('/:id/notificaciones')
  .get((req, res) => notificacionController.obtenerDeUsuario(req, res))

export default router
