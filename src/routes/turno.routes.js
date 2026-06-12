import express from 'express'
import { turnoController } from '../config/dependencies.js'

const router = express.Router()

router.route('/')
    .get((req, res) => turnoController.findAllPaginated(req, res))

router.route('/:id')
    .get((req, res) => turnoController.findById(req, res))
    .post((req, res) => turnoController.solicitarCambioFecha(req, res))

router.route('/:id/cancelar')
    .patch((req, res) => turnoController.cancelarTurno(req, res))

router.route('/:id/realizado')
    .patch((req, res) => turnoController.marcarTurnoComoRealizado(req, res))




export default router
