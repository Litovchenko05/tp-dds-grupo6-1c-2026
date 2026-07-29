import express from 'express'
import { pacienteController } from '../config/dependencies.js'

const router = express.Router()

router
  .route('/')
  .get((req, res) =>
    // #swagger.tags = ['Pacientes']
    // #swagger.summary = 'Obtener listado de pacientes paginado'
    // #swagger.description = 'Recupera una lista paginada de todos los pacientes del sistema.'
    pacienteController.findAllPaginated(req, res)
  )
  .post((req, res) =>
    // #swagger.tags = ['Pacientes']
    // #swagger.summary = 'Crear un nuevo paciente'
    // #swagger.description = 'Da de alta un perfil de paciente de forma manual.'
    pacienteController.createPaciente(req, res)
  )

router.route('/:id').get((req, res) =>
  // #swagger.tags = ['Pacientes']
  // #swagger.summary = 'Obtener paciente por ID'
  // #swagger.description = 'Recupera el perfil completo de un paciente específico mediante su ID de MongoDB.'
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID del paciente', required: true, type: 'string' } */
  pacienteController.findById(req, res)
)


router.route('/:id/turnos/:turnoId').patch((req, res) =>
  // #swagger.tags = ['Pacientes', 'Turnos']
  // #swagger.summary = 'Cambiar estado de un turno'
  // #swagger.description = 'Permite al paciente modificar el estado de uno de sus turnos (ej. cancelarlo).'
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID del paciente', required: true, type: 'string' } */
  /* #swagger.parameters['turnoId'] = { in: 'path', description: 'ID del turno a modificar', required: true, type: 'string' } */
  pacienteController.cambiarEstadoDeTurno(req, res)
)

router.route('/:idUsuario/turnos/:idTurno').post((req, res) =>
  // #swagger.tags = ['Pacientes', 'Turnos']
  // #swagger.summary = 'Reservar un turno'
  // #swagger.description = 'Permite al paciente reservar un turno.'
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID de usuario del paciente', required: true, type: 'string' } */
  /* #swagger.parameters['turnoId'] = { in: 'path', description: 'ID del turno a reservar', required: true, type: 'string' } */
  pacienteController.reservarTurno(req, res)
)
router.route('/:id/historial').get((req, res) =>
  // #swagger.tags = ['Pacientes', 'Historial Clínico']
  // #swagger.summary = 'Consultar historial clínico propio'
  // #swagger.description = 'Recupera el historial de atenciones médicas y antecedentes del paciente.'
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID del paciente', required: true, type: 'string' } */
  pacienteController.consultarHistorial(req, res)
)




export default router
