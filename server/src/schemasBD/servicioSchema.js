import mongoose from 'mongoose'
import { Servicio } from '../models/servicio.js'

export const ServicioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    tipo: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'servicios',
  }
)

ServicioSchema.loadClass(Servicio)
export const ServicioModel = mongoose.model('Servicio', ServicioSchema)
