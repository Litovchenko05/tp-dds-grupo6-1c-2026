import express from 'express'
import { MedicoService } from '../services/medico.service.js'
import { medicoRepository } from '../repositories/datosPrueba.enMemoria.js'
import { MedicoController } from '../controllers/medico.controller.js'


const medicoService = new MedicoService({ medicoRepository: medicoRepository })
const medicoController = new MedicoController({ medicoService: medicoService })

const router = express.Router()

router.route('/')
    .get((req, res) => medicoController.findAll(req, res))

router.route('/:id')
    .get((req, res) => medicoController.findById(req, res))

router.route('/:id/disponibilidad')
    .post((req, res) => medicoController.createDisponibilidad(req, res))

export default router
