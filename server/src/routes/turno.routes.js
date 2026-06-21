import express from 'express'
import { turnoController } from '../config/dependencies.js'

const router = express.Router()

router.route('/').get((req, res) =>
  // #swagger.tags = ['Turnos Globales']
  // #swagger.summary = 'Obtener todos los turnos'
  // #swagger.description = 'Recupera un listado global y paginado de los turnos de la clínica.'
  turnoController.findAllPaginated(req, res)
)

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

router.route('/:id/cancelar').patch((req, res) =>
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
