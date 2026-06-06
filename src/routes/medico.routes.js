import express from 'express'
import { medicoController } from '../config/dependencies.js'

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

router
  .route('/:medicoId/turnos/:turnoId')
  .patch((req, res) => medicoController.cancelarTurno(req, res))
  .put((req, res) => medicoController.actualizarTurno(req, res))

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
  .route('/:medicoId/pacientes/:pacienteId/historial')
  .get((req, res) => medicoController.obtenerHistorialPaciente(req, res))

router
  .route('/:medicoId/disponibilidad')
  .get((req, res) => medicoController.obtenerDisponibilidad(req, res))


export default router
