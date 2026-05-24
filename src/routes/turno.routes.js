import express from 'express'
import { TurnoService } from '../services/turno.service.js'
import { turnoRepository } from '../repositories/datosPrueba.enMemoria.js'
import { TurnoController } from '../controllers/turno.controller.js'

const turnoService = new TurnoService({ turnoRepository: turnoRepository })
const turnoController = new TurnoController({ turnoService: turnoService })

const router = express.Router()

router.route('/').get((req, res) => turnoController.findAll(req, res))
router.route('/:id').get((req, res) => turnoController.findById(req, res))

export default router
