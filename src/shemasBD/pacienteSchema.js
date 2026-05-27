import mongoose from 'mongoose'
import { Paciente } from '../models/paciente.js'
import { UsuarioSchema } from './usuarioSchema.js'
import { ObraSchema } from './obraSocialSchema.js'

export const PacienteSchema = new mongoose.Schema(
  {
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
      type: ObraSchema,
      default: null,
    },
    usuario: UsuarioSchema,
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
