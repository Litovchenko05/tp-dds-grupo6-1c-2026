import mongoose from 'mongoose'
import { Paciente } from '../models/paciente.js'

export const PacienteSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El ID de usuario es obligatorio'],
    },
    dni: {
      type: String,
      required: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    obraSocial: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ObraSocial',
      default: null,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      default: null,
    },
    turnos: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Turno',
        },
      ],
      default: [],
    },
    historialDeTurnos: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Turno',
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'pacientes',
  }
)

PacienteSchema.loadClass(Paciente)

export const PacienteModel = mongoose.model('Paciente', PacienteSchema)
