import express from 'express'
import { ServicioModel } from '../schemasBD/servicioSchema.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const sedes = await ServicioModel.find().lean()
    return res.status(200).json(sedes)
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener las sedes', error: error.message })
  }
})

export default router
