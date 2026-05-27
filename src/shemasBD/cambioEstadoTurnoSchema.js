import mongoose from 'mongoose'
import { UsuarioSchema } from './usuarioSchema.js'
import { CambioEstadoTurno } from '../models/cambioEstadoTurno.js'
import { EstadoTurno } from '../models/EstadoTurno.enum.js'

export const CambioEstadoTurnoSchema = new mongoose.Schema(
  {
    fechaHoraIngreso: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    estado: {
      type: String,
      enum: Object.values(EstadoTurno),
      required: true,
      default: EstadoTurno.DISPONIBLE
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
