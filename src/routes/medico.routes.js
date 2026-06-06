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
  sedeRepository: sedeRepository
  turnoService: turnoService,
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
  })

router.route('/:id/turnos').get((req, res) => medicoController.obtenerTurnos(req, res))
//GET /medicos/1/disponibilidades?nombreServicio=Cardiologia&&estadoTurno=DISPONIBLE

router
  .route('/:id/turnos/:idTurno/solicitarCambioFecha')
  .post((req, res) => medicoController.solicitarCambioFecha(req, res))

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

router.route('/:id/turnos').get((req, res) => medicoController.obtenerTurnos(req, res))
//GET /medicos/1/disponibilidades?nombreServicio=Cardiologia&&estadoTurno=DISPONIBLE

router
  .route('/:id/turnos/:idTurno/solicitarCambioFecha')
  .post((req, res) => medicoController.solicitarCambioFecha(req, res))

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
