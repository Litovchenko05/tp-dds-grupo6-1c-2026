import mongoose from 'mongoose'
import { Paciente } from '../models/paciente.js'
import { UsuarioSchema } from './usuarioSchema.js'

const PacienteSchema = new mongoose.Schema(
  {
    usuario: UsuarioSchema,
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
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    plan: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'pacientes',
  }
)

PacienteSchema.loadClass(Paciente)

export const PacienteModel = mongoose.model('Paciente', PacienteSchema)
