import express from 'express'
import { MedicoService } from '../services/medico.service.js'
import { MedicoRepository } from '../repositories/medico.repository.js'
import { MedicoController } from '../controllers/medico.controller.js'
import { AgendaService } from '../services/agenda.service.js'
import { TurnoRepository } from '../repositories/turno.repository.js'
import { EspecialidadRepository } from '../repositories/especialidad.repository.js'
import { PracticaRepository } from '../repositories/practica.repository.js'
import { SedeRepository } from '../repositories/sede.repository.js'
import { TurnoService } from '../services/turno.service.js'
import { PacienteService } from '../services/paciente.service.js'

const turnoRepository = new TurnoRepository()
const especialidadRepository = new EspecialidadRepository()
const practicaRepository = new PracticaRepository()
const sedeRepository = new SedeRepository()
const turnoService = new TurnoService({ turnoRepository: turnoRepository })
const agendaService = new AgendaService({ turnoRepository: turnoRepository })

const medicoService = new MedicoService({
  medicoRepository: MedicoRepository,
  agendaService: agendaService,
  especialidadRepository: especialidadRepository,
  practicaRepository: practicaRepository,
  sedeRepository: sedeRepository,
  turnoService: turnoService,
})

const medicoController = new MedicoController({
  medicoService: medicoService,
  turnoService: turnoService,
  pacienteService: PacienteService
})

const router = express.Router()

router
  .route('/')
  .get((req, res) => medicoController.findAll(req, res))
  .post((req, res) => medicoController.createMedico(req, res))

router
  .route('/:id')
  .get((req, res) => medicoController.findById(req, res))

router.route('/:id/turnos')
  .get((req, res) => medicoController.obtenerTurnos(req, res)) //GET /medicos/1/disponibilidades?nombreServicio=Cardiologia&&estadoTurno=DISPONIBLE  

router
  .route('/:id/turnos/:idTurno')
  .post((req, res) => medicoController.solicitarCambioFecha(req, res))
  .patch((req, res) => medicoController.cancelarTurno(req, res))
  .put((req, res) => medicoController.actualizarTurno(req, res))

router
  .route('/:id/turnos/:idTurno/cambios')
  .post((req, res) => medicoController.crearCambio(req, res))

router
  .route('/:id/disponibilidades')
  .post((req, res) => medicoController.createDisponibilidad(req, res))

router
  .route('/:id/disponibilidades/:idDisponibilidad')
  .put((req, res) => medicoController.modificarDisponibilidad(req, res))

router
  .route('/:id/disponibilidades')
  .get((req, res) => medicoController.obtenerDisponibilidad(req, res))

router
  .route('/:id/servicios')
  .get((req, res) => medicoController.obtenerServicios(req, res))
  .post((req, res) => medicoController.agregarServicio(req, res))

router
  .route('/:id/servicios/:nombreServicio')
  .put((req, res) => medicoController.modificarServicio(req, res))

router
  .route('/:id/servicios/:tipoServicio/:servicioNombre')
  .delete((req, res) => {
    medicoController.deleteServicio(req, res)
  })

router
  .route('/:id/pacientes/:idPaciente/historial')
  .get((req, res) => medicoController.obtenerHistorialPaciente(req, res))


export default router
