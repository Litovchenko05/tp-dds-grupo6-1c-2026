import mongoose from 'mongoose'
import { UsuarioSchema } from './usuarioSchema.js'
import { CambioEstadoTurno } from '../models/cambioEstadoTurno.js'

export const CambioEstadoTurnoSchema = new mongoose.Schema(
  {
    fechaHoraIngreso: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    estado: {
      type: String,
      required: true,
      trim: true,
    },
    usuario: UsuarioSchema,
    motivo: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    _id: false,
  }
)

CambioEstadoTurnoSchema.loadClass(CambioEstadoTurno)

export const CambioEstadoTurnoModel = mongoose.model('CambioEstadoTurno', CambioEstadoTurnoSchema)
