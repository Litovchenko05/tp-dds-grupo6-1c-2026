import express from 'express'
import { TurnoService } from '../services/turno.service.js'
import { TurnoRepository } from '../repositories/turno.repository.js'
import { TurnoController } from '../controllers/turno.controller.js'

const turnoService = new TurnoService({ turnoRepository: TurnoRepository })
const turnoController = new TurnoController({ turnoService: turnoService })

const router = express.Router()

router.route('/').get((req, res) => turnoController.findAll(req, res))
router.route('/:id').get((req, res) => turnoController.findById(req, res))

//FILTROS
//Por profesional
router.route('/buscarTurnos/profesional').get((req, res) => turnoController.findTurnosByProfesional(req, res))
//Por especialidad
router.route('/buscarTurnos/especialidad').get((req, res) => turnoController.findTurnosByEspecialidad(req, res))
//Por práctica
router.route('/buscarTurnos/practica').get((req, res) => turnoController.findTurnosByPractica(req, res))
//Por Sede
router.route('/buscarTurnos/sede').get((req, res) => turnoController.findTurnosBySede(req, res))
//Por rango de fechas
router.route('/buscarTurnos/rangoDeFechas').get((req, res) => turnoController.findTurnosByRangoDeFechas(req, res))
export default router
