import express from 'express'
import { servicioController } from '../config/dependencies.js'

const router = express.Router()

router.route('/especialidades').get((req, res) => servicioController.findEspecialidades(req, res))
router.route('/practicas').get((req, res) => servicioController.findPracticas(req, res))

export default router
