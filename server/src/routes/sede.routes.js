import { SedeModel } from '../schemasBD/sedeSchema.js'
import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const sedes = await SedeModel.find().lean()
    return res.status(200).json(sedes)
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener las sedes', error: error.message })
  }
})

export default router
