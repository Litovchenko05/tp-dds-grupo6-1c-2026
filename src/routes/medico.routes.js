import express from 'express'
import { MedicoService } from '../services/medico.service.js'
import { medicoRepository } from '../repositories/datosPrueba.enMemoria.js'
import { MedicoController } from '../controllers/medico.controller.js'
import { AgendaService } from '../services/agenda.service.js'
import { TurnoRepository } from '../repositories/turno.repository.js'


const turnoRepository = new TurnoRepository()
const agendaService = new AgendaService({ turnoRepository: turnoRepository })
const medicoService = new MedicoService({ medicoRepository: medicoRepository, agendaService: agendaService })
const medicoController = new MedicoController({ medicoService: medicoService })

const router = express.Router()

router.route('/')
    .get((req, res) => medicoController.findAll(req, res))

router.route('/:id')
    .get((req, res) => medicoController.findById(req, res))

router.route('/:id/disponibilidad')
    .post((req, res) => medicoController.createDisponibilidad(req, res))

router.route('/:id/modificarDisponibilidad/:idDisponibilidad')
    .put((req, res) => medicoController.modificarDisponibilidad(req, res))

export default router
