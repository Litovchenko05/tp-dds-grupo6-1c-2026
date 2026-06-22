import express from 'express'
import notificacionRouter from './notificacion.routes.js'
import medicoRouter from './medico.routes.js'
import turnoRouter from './turno.routes.js'
import pacienteRouter from './paciente.routes.js'
import usuarioRouter from './usuario.routes.js'
import authRouter from './auth.routes.js'

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
router.use('/usuarios', usuarioRouter)
router.use('/auth', authRouter)

export default router
