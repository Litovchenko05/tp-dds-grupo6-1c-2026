import express from 'express'
import { ServicioModel } from '../schemasBD/servicioSchema.js'
import { servicioController } from '../config/dependencies.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const servicios = await ServicioModel.find().lean()
    return res.status(200).json(servicios)
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener los servicios', error: error.message })
  }
})

router.route('/especialidades').get((req, res) => servicioController.findEspecialidades(req, res))
router.route('/practicas').get((req, res) => servicioController.findPracticas(req, res))

export default router
