import express from 'express'
import { pacienteController } from '../config/dependencies.js'

const router = express.Router()

router
  .route('/')
  .get((req, res) => pacienteController.findAllPaginated(req, res))
  .post((req, res) => pacienteController.createPaciente(req, res))


router.
  route('/:id')
  .get((req, res) => pacienteController.findById(req, res))


router
  .route('/:id/turnos/:turnoId')
  .patch((req, res) => pacienteController.cambiarEstadoDeTurno(req, res))
router
  .route('/:id/historial')
  .get((req, res) => pacienteController.consultarHistorial(req, res))


export default router
