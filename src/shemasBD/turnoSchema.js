import mongoose from 'mongoose'
import { Turno } from '../models/turno.js'
import { MedicoSchema } from './medicoSchema.js'
import { SedeSchema } from './sedeSchema.js'
import { PracticaSchema } from './practicaSchema.js'
import { PacienteSchema } from './pacienteSchema.js'
import { CambioEstadoTurnoSchema } from './cambioEstadoTurnoSchema.js'

const TurnoSchema = new mongoose.Schema(
  {
    medico: {
      type: MedicoSchema,
      required: true,
    },
    paciente: {
      type: PacienteSchema,
      default: null,
    },
    fechaHora: {
      type: Date,
      required: true,
    },
    sede: {
      type: SedeSchema,
      required: true,
    },
    practica: {
      type: PracticaSchema,
      required: true,
    },
    estado: {
      type: String,
      required: true,
      trim: true,
      default: 'DISPONIBLE',
    },
    historialEstados: {
      type: [CambioEstadoTurnoSchema],
      default: [],
    },
    costo: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'turnos',
  }
)

TurnoSchema.loadClass(Turno)

export const TurnoModel = mongoose.model('Turno', TurnoSchema)
