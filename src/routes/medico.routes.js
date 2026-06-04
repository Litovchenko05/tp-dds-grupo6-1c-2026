import express from 'express'
import { MedicoService } from '../services/medico.service.js'
import { MedicoRepository } from '../repositories/medico.repository.js'
import { MedicoController } from '../controllers/medico.controller.js'
import { AgendaService } from '../services/agenda.service.js'
import { TurnoRepository } from '../repositories/turno.repository.js'
import { TurnoService } from '../services/turno.service.js'

const turnoRepository = new TurnoRepository()
const turnoService = new TurnoService()
const agendaService = new AgendaService({ turnoRepository: turnoRepository })
const medicoService = new MedicoService({
  medicoRepository: MedicoRepository,
  agendaService: agendaService,
})
const medicoController = new MedicoController({
  medicoService: medicoService,
  turnoService: turnoService,
})

const router = express.Router()

router.route('/').get((req, res) => medicoController.findAll(req, res))

router.route('/:id').get((req, res) => medicoController.findById(req, res))

router.route('/nuevoMedico').post((req, res) => medicoController.createMedico(req, res))

router
  .route('/:id/disponibilidad')
  .post((req, res) => medicoController.createDisponibilidad(req, res))

router
  .route('/:id/modificarDisponibilidad/:idDisponibilidad')
  .patch((req, res) => medicoController.modificarDisponibilidad(req, res))

router
  .route('/:medicoId/turnos/:turnoId')
  .delete((req, res) => medicoController.cancelarTurno(req, res))
  .patch((req, res) => medicoController.actualizarTurno(req, res))

router
  .route('/:medicoId/turnos/:turnoId/cambios')
  .post((req, res) => medicoController.crearCambio(req, res))

router
  .route('/:medicoId/servicios')
  .get((req, res) => medicoController.obtenerServicios(req, res))
  .post((req, res) => medicoController.agregarServicio(req, res))

router
  .route('/:medicoId/servicios/:servicioId')
  .delete((req, res) => medicoController.removerServicio(req, res))

router
  .route('/:medicoId/disponibilidad')
  .get((req, res) => medicoController.obtenerDisponibilidad(req, res))

router
  .route('/:medicoId/pacientes/:pacienteId/historial')
  .get((req, res) => medicoController.obtenerHistorialPaciente(req, res))

export default router
