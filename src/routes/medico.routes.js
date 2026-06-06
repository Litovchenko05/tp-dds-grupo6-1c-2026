import express from 'express'
import { MedicoService } from '../services/medico.service.js'
import { MedicoRepository } from '../repositories/medico.repository.js'
import { MedicoController } from '../controllers/medico.controller.js'
import { AgendaService } from '../services/agenda.service.js'
import { TurnoRepository } from '../repositories/turno.repository.js'
import { EspecialidadRepository } from '../repositories/especialidad.repository.js'
import { PracticaRepository } from '../repositories/practica.repository.js'
import { SedeRepository } from '../repositories/sede.repository.js'

const turnoRepository = new TurnoRepository()
const especialidadRepository = new EspecialidadRepository()
const practicaRepository = new PracticaRepository()
const sedeRepository = new SedeRepository()
const agendaService = new AgendaService({ turnoRepository: turnoRepository })
const medicoService = new MedicoService({
  medicoRepository: MedicoRepository,
  agendaService: agendaService,
  especialidadRepository: especialidadRepository,
  practicaRepository: practicaRepository,
  sedeRepository: sedeRepository
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
  .post((req, res) => medicoController.createServicio(req, res))
router
  .route('/:id/modificarServicio/:nombreServicio')
  .put((req, res) => medicoController.modificarServicio(req, res))

//router
//.route("/:id/darDeBajaServicio/:tipoServicio/:servicioNombre")
//.delete((req,res)=> medicoController.deleteServicio(req,res))
router
  .route('/:id/darDeBajaServicio/:tipoServicio/:servicioNombre')
  .delete((req, res) => {
    medicoController.deleteServicio(req, res)
  });

export default router
