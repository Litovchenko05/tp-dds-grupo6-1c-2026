import mongoose from 'mongoose'
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
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
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
