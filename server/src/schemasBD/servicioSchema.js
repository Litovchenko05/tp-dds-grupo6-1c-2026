import mongoose from 'mongoose'
import { Servicio } from '../models/servicio.js'

export const ServicioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      enum: ['especialidad, practica'],
      required: true,
    },
  },
  { collection: 'servicios' }
)

ServicioSchema.loadClass(Servicio)
export const ServicioModel = mongoose.model('Servicio', ServicioSchema)
