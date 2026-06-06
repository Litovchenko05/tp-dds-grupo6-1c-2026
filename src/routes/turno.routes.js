import express from 'express'
import { turnoController } from '../config/dependencies.js'

const router = express.Router()

router.route('/')
    .get((req, res) => turnoController.findAll(req, res))

router.route('/:id')
    .get((req,res) => turnoController.findById(req, res))

router.route('/:id/cancelar')
    .patch((req,res) => turnoController.cancelarTurno(req, res))

router.route('/:id/realizado')
    .patch((req,res) => turnoController.marcarTurnoComoRealizado(req, res))

router.route('/:id/solicitarCambioFecha')
    .post((req,res) => turnoController.solicitarCambioFecha(req, res))

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
