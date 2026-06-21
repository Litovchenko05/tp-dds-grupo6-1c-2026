import express from 'express'
import { authController } from '../config/dependencies.js'

const router = express.Router()

router.route('/registro').post((req, res) => authController.registrarUsuario(req, res))

export default router
