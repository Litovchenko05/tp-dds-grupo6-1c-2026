import express from 'express'
import { MedicoService } from '../services/medico.service.js'
import { MedicoRepository } from '../repositories/medico.repository.js'
import { MedicoController } from '../controllers/medico.controller.js'
import { AgendaService } from '../services/agenda.service.js'
import { TurnoRepository } from '../repositories/turno.repository.js'

const turnoRepository = new TurnoRepository()
const agendaService = new AgendaService({ turnoRepository: turnoRepository })
const medicoService = new MedicoService({
  medicoRepository: MedicoRepository,
  agendaService: agendaService,
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
  .put((req, res) => medicoController.modificarDisponibilidad(req, res))
router
  .route('/:id/servicio')
  .post((req,res)=> medicoController.createServicio(req,res))
router
  .route('/:id/modificarServicio/servicio')
  .put((req,res)=>medicoController.modificarServicio(req,res))
router
  .route(":id/:tipoServicio/:servicioId")
  .delete((req,res)=> medicoController.deleteServicio(req,res))
  .patch((req, res) => medicoController.modificarDisponibilidad(req, res))

export default router
