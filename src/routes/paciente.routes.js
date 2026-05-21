import express from 'express'
import { PacienteService } from '../services/paciente.service.js'
import { turnoRepository } from '../repositories/datosPrueba.enMemoria.js'
import { PacienteRepository } from '../repositories/paciente.repository.js'
import { PacienteController } from '../controllers/paciente.controller.js'

const pacienteRepository = new PacienteRepository()
const pacienteService = new PacienteService({
  pacienteRepository: pacienteRepository,
  turnoRepository: turnoRepository,
})
const pacienteController = new PacienteController({
  pacienteService: pacienteService,
})

const router = express.Router()

router
  .route('/:pacienteId/reservarTurno/:turnoId')
  .post((req, res) => pacienteController.reservarTurno(req, res))
router
  .route('/:pacienteId/consultarHistorial')
  .get((req, res) => pacienteController.consultarHistorial(req, res))
router
  .route('/:pacienteId/solicitarCambioDeFecha/:turnoId')
  .put((req, res) => pacienteController.solicitarCambioDeFecha(req, res))
export default router
