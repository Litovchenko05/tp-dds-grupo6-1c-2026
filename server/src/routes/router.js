import express from 'express'
import notificacionRouter from './notificacion.routes.js'
import medicoRouter from './medico.routes.js'
import turnoRouter from './turno.routes.js'
import pacienteRouter from './paciente.routes.js'
import authRouter from './auth.routes.js'
import servicioRouter from './servicio.routes.js'
import sedeRouter from './sede.routes.js'
import planRouter from './plan.routes.js'
import obraSocialRouter from './obraSocial.routes.js'

const router = express.Router()

router.get('/healthcheck', (req, res) => {
  res.status(200).json({
    system: 'Sweet Medical - Plataforma de Seguro de la Salud',
    status: 'available',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

router.use('/notificaciones', notificacionRouter)
router.use('/turnos', turnoRouter)
router.use('/medicos', medicoRouter)
router.use('/pacientes', pacienteRouter)
router.use('/auth', authRouter)
router.use('/sedes', sedeRouter)
router.use('/servicios', servicioRouter)
router.use('/planes', planRouter)
router.use('/obrasSociales', obraSocialRouter)

export default router
