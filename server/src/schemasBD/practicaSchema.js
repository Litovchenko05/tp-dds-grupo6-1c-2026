import mongoose from 'mongoose'
import { Practica } from '../models/Practica.js'
import { ServicioSchema } from '../schemasBD/servicioSchema.js'

export const PracticaSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
      trim: true,
    },
    servicio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Servicio',
      required: true,
    },
    duracionTurnoEnMins: {
      type: Number,
      required: true,
      trim: true,
    },
    costo: {
      type: Number,
      required: true,
      trim: true,
    },
    sede: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sede',
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'practicas',
  }
)

PracticaSchema.loadClass(Practica)

export const PracticaModel = mongoose.model('Practica', PracticaSchema)
