import express from 'express'
import { authController } from '../config/dependencies.js'
import { identificarUsuario } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.route('/registro').post((req, res) =>
  // #swagger.tags = ['Autenticación']
  // #swagger.summary = 'Registrar un nuevo usuario'
  // #swagger.description = 'Registra un paciente o médico en el sistema, creando su cuenta en Keycloak y su perfil en MongoDB.'
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del usuario a registrar (nombre, username, password, rol, y DNI/Matrícula según corresponda).',
        required: true,
        type: 'object'
  } */
  authController.registrarUsuario(req, res)
)

router
  .route('/identificacion')
  .get(identificarUsuario, (req, res) => authController.obtenerPerfil(req, res))

export default router
