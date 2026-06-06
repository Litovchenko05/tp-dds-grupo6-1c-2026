import express from 'express'
import { PacienteService } from '../services/paciente.service.js'
import { TurnoRepository } from '../repositories/turno.repository.js'
import { PacienteRepository } from '../repositories/paciente.repository.js'
import { PacienteController } from '../controllers/paciente.controller.js'

const pacienteRepository = new PacienteRepository()
const pacienteService = new PacienteService({
  pacienteRepository: pacienteRepository,
  turnoRepository: TurnoRepository,
})
const pacienteController = new PacienteController({
  pacienteService: pacienteService,
})

const router = express.Router()

router.route('/').get((req, res) => pacienteController.findAll(req, res))

router.route('/:id').get((req, res) => pacienteController.findById(req, res))

router
  .route('/nuevoPaciente')
  .post((req, res) => pacienteController.createPaciente(req, res))

router
  .route('/:pacienteId/turnos/:turnoId')
  .patch((req, res) => pacienteController.cambiarEstadoDeTurno(req, res))
router
  .route('/:pacienteId/consultarHistorial')
  .get((req, res) => pacienteController.consultarHistorial(req, res))
router
  .route('/:pacienteId/solicitarCambioDeFecha/:turnoId')
  .put((req, res) => pacienteController.solicitarCambioDeFecha(req, res))


export default router
