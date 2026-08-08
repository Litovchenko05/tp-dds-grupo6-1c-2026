import mongoose from 'mongoose'
import { Practica } from '../models/Practica.js'
import { DisponibilidadSchema } from '../schemasBD/disponibilidadSchema.js'

export const PracticaSchema = new mongoose.Schema(
  {
    servicio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Servicio',
      required: true,
    },
    duracionEnMins: {
      type: Number,
      required: true,
    },
    costo: {
      type: Number,
      required: true,
    },
    sede: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sede',
      required: true,
      trim: true,
    },
    disponibilidad: {
      type: DisponibilidadSchema,
      default: null,
    },
  },
  { timestamps: true, collection: 'practicas' }
)

PracticaSchema.loadClass(Practica)

export const PracticaModel = mongoose.model('Practica', PracticaSchema)
