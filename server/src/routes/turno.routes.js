import express from 'express'
import { turnoController } from '../config/dependencies.js'

const router = express.Router()

router.route('/').get((req, res) =>
  // #swagger.tags = ['Turnos Globales']
  // #swagger.summary = 'Obtener todos los turnos'
  // #swagger.description = 'Recupera un listado global y paginado de los turnos de la clínica.'
  turnoController.findAllPaginated(req, res)
)

router.route('/filtered').get((req, res) =>
  // #swagger.tags = ['Turnos Filtrados']
  // #swagger.summary = 'Obtener todos los turnos por filtros, tales como nombre de profesional, especialidad, practica, sede y rango de fechas.'
  // #swagger.description = 'Recupera un listado global y paginado de los turnos de la clínica filtrado por los filtros que se mandan.'
  turnoController.findAllFilteredPaginated(req, res)
)
router.route('/:idUsuario/reservados').get((req, res) =>
  // #swagger.tags = ['Pacientes', 'Turnos']
  // #swagger.summary = 'ver turnos reservados'
  // #swagger.description = 'Permite al paciente ver sus turnos.'
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID de usuario del paciente', required: true, type: 'string' } */
  turnoController.turnosReservados(req, res)
)

router.route('/servicios').get((req, res) => turnoController.obtenerTodosLosServicios(req, res))

router
  .route('/especialidades')
  .get((req, res) => turnoController.obtenerTodasLasEspecialidades(req, res))
router
  .route('/especialidades/:id')
  .get((req, res) => turnoController.obtenerLaEspecialidad(req, res))

router.route('/practicas').get((req, res) => turnoController.obtenerTodasLasPracticas(req, res))
router.route('/practicas/:id').get((req, res) => turnoController.obtenerLaPractica(req, res))

router
  .route('/:id')
  .get((req, res) =>
    // #swagger.tags = ['Turnos Globales']
    // #swagger.summary = 'Obtener un turno por ID'
    // #swagger.description = 'Busca los detalles de un turno específico en el sistema.'
    /* #swagger.parameters['id'] = { in: 'path', description: 'ID del turno', required: true, type: 'string' } */
    turnoController.findById(req, res)
  )
  .post((req, res) =>
    // #swagger.tags = ['Turnos Globales']
    // #swagger.summary = 'Solicitar cambio de fecha'
    // #swagger.description = 'Inicia una solicitud de reprogramación para un turno específico a nivel sistema.'
    /* #swagger.parameters['id'] = { in: 'path', description: 'ID del turno', required: true, type: 'string' } */
    turnoController.solicitarCambioFecha(req, res)
  )

router.route('/:idTurno/cancelar').patch((req, res) =>
  // #swagger.tags = ['Turnos Globales']
  // #swagger.summary = 'Cancelar un turno globalmente'
  // #swagger.description = 'Cambia el estado del turno a cancelado desde el módulo administrador de turnos.'
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID del turno a cancelar', required: true, type: 'string' } */
  turnoController.cancelarTurno(req, res)
)

router.route('/:id/realizado').patch((req, res) =>
  // #swagger.tags = ['Turnos Globales']
  // #swagger.summary = 'Marcar turno como realizado'
  // #swagger.description = 'Actualiza el estado del turno indicando que la consulta médica finalizó con éxito.'
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID del turno a finalizar', required: true, type: 'string' } */
  turnoController.marcarTurnoComoRealizado(req, res)
)

export default router
