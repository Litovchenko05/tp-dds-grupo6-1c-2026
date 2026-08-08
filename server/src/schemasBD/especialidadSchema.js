import mongoose from 'mongoose'
import { Especialidad } from '../models/Especialidad.js'
import { DisponibilidadSchema } from '../schemasBD/disponibilidadSchema.js'

export const EspecialidadSchema = new mongoose.Schema(
  {
    servicio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Servicio',
      required: true,
      trim: true,
    },
    duracionTurnoEnMins: {
      type: Number,
      required: true,
    },
    costoConsulta: {
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
  {
    timestamps: true,
    collection: 'especialidades',
  }
)

EspecialidadSchema.loadClass(Especialidad)

export const EspecialidadModel = mongoose.model('Especialidad', EspecialidadSchema)
