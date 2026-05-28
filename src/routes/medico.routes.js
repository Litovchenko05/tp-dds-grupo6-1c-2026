import express from 'express'
import { MedicoService } from '../services/medico.service.js'
import { MedicoRepository } from '../repositories/medico.repository.js'
import { MedicoController } from '../controllers/medico.controller.js'
import { AgendaService } from '../services/agenda.service.js'
import { TurnoRepository } from '../repositories/turno.repository.js'

const turnoRepository = new TurnoRepository()
const turnoService = new TurnoService({ turnoRepository: turnoRepository })
const agendaService = new AgendaService({ turnoRepository: turnoRepository })
const medicoService = new MedicoService({
  medicoRepository: MedicoRepository,
  agendaService: agendaService,
  turnoService: turnoService
})
const medicoController = new MedicoController({ medicoService: medicoService })

const router = express.Router()

router.route('/').get((req, res) => medicoController.findAll(req, res))

router.route('/:id').get((req, res) => medicoController.findById(req, res))

router
  .route('/nuevoMedico')
  .post((req, res) => medicoController.createMedico(req, res))

router
  .route('/:id/disponibilidad')
  .post((req, res) => medicoController.createDisponibilidad(req, res))

router
  .route('/:id/modificarDisponibilidad/:idDisponibilidad')
  .patch((req, res) => medicoController.modificarDisponibilidad(req, res))

router
  .route('/:id/turnos')
  .get((req, res) => medicoController.obtenerTurnos(req, res))
  //GET /medicos/1/disponibilidades?nombreServicio=Cardiologia&&estadoTurno=DISPONIBLE

router
  .route('/:id/turnos/:idTurno/solicitarCambioFecha')
  .post((req, res) => medicoController.solicitarCambioFecha(req, res))
  
export default router
