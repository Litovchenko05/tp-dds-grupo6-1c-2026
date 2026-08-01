import express from 'express'
import { medicoController } from '../config/dependencies.js'

const router = express.Router()

router
  .route('/')
  .get((req, res) =>
    // #swagger.tags = ['Médicos']
    // #swagger.summary = 'Obtener listado de médicos paginado'
    // #swagger.description = 'Recupera una lista paginada de todos los médicos registrados en el sistema.'
    /* #swagger.parameters['page'] = { in: 'query', description: 'Número de página', type: 'integer' } */
    /* #swagger.parameters['limit'] = { in: 'query', description: 'Cantidad de resultados por página', type: 'integer' } */
    medicoController.findAllPaginated(req, res)
  )
  .post((req, res) =>
    // #swagger.tags = ['Médicos']
    // #swagger.summary = 'Crear un nuevo médico'
    // #swagger.description = 'Da de alta un perfil de médico de forma manual.'
    medicoController.createMedico(req, res)
  )

router.route('/:id/estadisticas').get((req, res) =>
  // #swagger.tags = ['Médicos', 'Estadísticas']
  // #swagger.summary = 'Obtener estadísticas del médico'
  // #swagger.description = 'Recupera las estadísticas de turnos y métricas del médico.'
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID del médico', required: true, type: 'string' } */
  medicoController.obtenerEstadisticas(req, res)
)

router.route('/:id').get((req, res) =>
  // #swagger.tags = ['Médicos']
  // #swagger.summary = 'Obtener médico por ID'
  // #swagger.description = 'Recupera el perfil completo de un médico específico mediante su ID de MongoDB.'
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID del médico', required: true, type: 'string' } */
  medicoController.findById(req, res)
)

router.route('/:id/turnos').get((req, res) =>
  // #swagger.tags = ['Médicos', 'Turnos']
  // #swagger.summary = 'Obtener turnos de un médico'
  // #swagger.description = 'Recupera los turnos asociados a un médico. Permite filtrar por servicio y estado.'
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID del médico', required: true, type: 'string' } */
  /* #swagger.parameters['nombreServicio'] = { in: 'query', description: 'Filtrar por nombre del servicio (ej: Cardiologia)', required: false, type: 'string' } */
  /* #swagger.parameters['estadoTurno'] = { in: 'query', description: 'Filtrar por estado del turno (ej: DISPONIBLE)', required: false, type: 'string' } */
  medicoController.obtenerTurnos(req, res)
)

router
  .route('/:id/turnos/:idTurno')
  .post((req, res) =>
    // #swagger.tags = ['Médicos', 'Turnos']
    // #swagger.summary = 'Solicitar cambio de fecha de turno'
    // #swagger.description = 'El médico solicita la reprogramación de un turno existente.'
    /* #swagger.parameters['id'] = { in: 'path', description: 'ID del médico', required: true, type: 'string' } */
    /* #swagger.parameters['idTurno'] = { in: 'path', description: 'ID del turno', required: true, type: 'string' } */
    medicoController.solicitarCambioFecha(req, res)
  )
  .patch((req, res) =>
    // #swagger.tags = ['Médicos', 'Turnos']
    // #swagger.summary = 'Cancelar un turno'
    // #swagger.description = 'El médico cancela un turno específico.'
    /* #swagger.parameters['id'] = { in: 'path', description: 'ID del médico', required: true, type: 'string' } */
    /* #swagger.parameters['idTurno'] = { in: 'path', description: 'ID del turno a cancelar', required: true, type: 'string' } */
    medicoController.cancelarTurno(req, res)
  )
  .put((req, res) =>
    // #swagger.tags = ['Médicos', 'Turnos']
    // #swagger.summary = 'Actualizar datos de un turno'
    // #swagger.description = 'Modifica los detalles generales de un turno asignado a este médico.'
    /* #swagger.parameters['id'] = { in: 'path', description: 'ID del médico', required: true, type: 'string' } */
    /* #swagger.parameters['idTurno'] = { in: 'path', description: 'ID del turno', required: true, type: 'string' } */
    medicoController.actualizarTurno(req, res)
  )

router.route('/:id/turnos/:idTurno/reactivar').patch((req, res) =>
  // #swagger.tags = ['Médicos', 'Turnos']
  // #swagger.summary = 'Reactivar turno cancelado'
  // #swagger.description = 'Libera un turno cancelado y lo devuelve al estado disponible.'
  medicoController.reactivarTurno(req, res)
)

router.route('/:id/turnos/:idTurno/realizado').patch((req, res) =>
  // #swagger.tags = ['Médicos', 'Turnos']
  // #swagger.summary = 'Marcar turno como realizado'
  // #swagger.description = 'El médico marca un turno como realizado.'
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID del médico', required: true, type: 'string' } */
  /* #swagger.parameters['idTurno'] = { in: 'path', description: 'ID del turno', required: true, type: 'string' } */
  medicoController.marcarRealizado(req, res)
)

router.route('/:id/turnos/:idTurno/cambios').post((req, res) =>
  // #swagger.tags = ['Médicos', 'Turnos']
  // #swagger.summary = 'Registrar un cambio en el turno'
  // #swagger.description = 'Añade un registro al historial de cambios de un turno específico.'
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID del médico', required: true, type: 'string' } */
  /* #swagger.parameters['idTurno'] = { in: 'path', description: 'ID del turno', required: true, type: 'string' } */
  medicoController.crearCambio(req, res)
)

router
  .route('/:medicoId/disponibilidades')
  .get((req, res) =>
    // #swagger.tags = ['Médicos', 'Disponibilidad']
    // #swagger.summary = 'Obtener disponibilidades del médico'
    // #swagger.description = 'Lista los horarios y días que el médico tiene configurados como disponibles.'
    /* #swagger.parameters['id'] = { in: 'path', description: 'ID del médico', required: true, type: 'string' } */
    medicoController.obtenerDisponibilidad(req, res)
  )
  .post((req, res) =>
    // #swagger.tags = ['Médicos', 'Disponibilidad']
    // #swagger.summary = 'Crear bloque de disponibilidad'
    // #swagger.description = 'Define un nuevo rango de días y horarios de atención para el médico.'
    /* #swagger.parameters['id'] = { in: 'path', description: 'ID del médico', required: true, type: 'string' } */
    medicoController.createDisponibilidad(req, res)
  )

router.route('/:id/disponibilidades/:idDisponibilidad').patch((req, res) =>
  // #swagger.tags = ['Médicos', 'Disponibilidad']
  // #swagger.summary = 'Modificar bloque de disponibilidad'
  // #swagger.description = 'Edita un rango horario existente del médico.'
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID del médico', required: true, type: 'string' } */
  /* #swagger.parameters['idDisponibilidad'] = { in: 'path', description: 'ID de la disponibilidad a modificar', required: true, type: 'string' } */
  medicoController.modificarDisponibilidad(req, res)
)

router
  .route('/:medicoId/servicios')
  .get((req, res) =>
    // #swagger.tags = ['Médicos', 'Servicios']
    // #swagger.summary = 'Obtener servicios del médico'
    // #swagger.description = 'Recupera la lista de servicios médicos que ofrece el profesional.'
    /* #swagger.parameters['id'] = { in: 'path', description: 'ID del médico', required: true, type: 'string' } */
    medicoController.obtenerServicios(req, res)
  )
  .post((req, res) =>
    // #swagger.tags = ['Médicos', 'Servicios']
    // #swagger.summary = 'Agregar servicio al médico'
    // #swagger.description = 'Vincula un nuevo servicio de atención al perfil del profesional.'
    /* #swagger.parameters['id'] = { in: 'path', description: 'ID del médico', required: true, type: 'string' } */
    medicoController.agregarServicio(req, res)
  )

router.route('/:id/servicios/:nombreServicio').put((req, res) =>
  // #swagger.tags = ['Médicos', 'Servicios']
  // #swagger.summary = 'Modificar servicio del médico'
  // #swagger.description = 'Edita las características de un servicio específico brindado por el médico.'
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID del médico', required: true, type: 'string' } */
  /* #swagger.parameters['nombreServicio'] = { in: 'path', description: 'Nombre del servicio actual', required: true, type: 'string' } */
  medicoController.modificarServicio(req, res)
)

router.route('/:id/servicios/:tipoServicio/:servicioNombre').delete((req, res) => {
  // #swagger.tags = ['Médicos', 'Servicios']
  // #swagger.summary = 'Eliminar servicio del médico'
  // #swagger.description = 'Desvincula un servicio médico del perfil del profesional.'
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID del médico', required: true, type: 'string' } */
  /* #swagger.parameters['tipoServicio'] = { in: 'path', description: 'Tipo o categoría del servicio', required: true, type: 'string' } */
  /* #swagger.parameters['servicioNombre'] = { in: 'path', description: 'Nombre exacto del servicio a eliminar', required: true, type: 'string' } */
  return medicoController.deleteServicio(req, res)
})

router.route('/:id/pacientes/:idPaciente/historial').get((req, res) =>
  // #swagger.tags = ['Médicos', 'Historial Clínico']
  // #swagger.summary = 'Ver historial clínico de un paciente'
  // #swagger.description = 'Permite al médico visualizar los antecedentes y el historial médico de un paciente específico.'
  /* #swagger.parameters['id'] = { in: 'path', description: 'ID del médico', required: true, type: 'string' } */
  /* #swagger.parameters['idPaciente'] = { in: 'path', description: 'ID del paciente a consultar', required: true, type: 'string' } */
  medicoController.obtenerHistorialPaciente(req, res)
)

export default router
