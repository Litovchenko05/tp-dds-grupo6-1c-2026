import mongoose from 'mongoose'
import { Paciente } from '../models/paciente.js'
import { UsuarioSchema } from './usuarioSchema.js'
import { ObraSchema } from './obraSocialSchema.js'

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
      type: ObraSchema,
      default: null,
    },
    plan: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    historialDeTurnos: {
      type: [mongoose.Schema.Types.Mixed],
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
