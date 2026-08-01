import mongoose from 'mongoose'
import { Turno } from '../models/turno.js'
import { CambioEstadoTurnoSchema } from './cambioEstadoTurnoSchema.js'

export const TurnoSchema = new mongoose.Schema(
  {
    medico: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medico',
      required: true,
    },
    paciente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Paciente',
      required: false,
      default: null,
    },
    fechaHora: {
      type: Date,
      required: true,
    },
    sede: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sede',
      required: true,
    },
    servicio: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: 'Servicio',
      required: true,
    },
    tipoDeServicio: {
      type: String,
      required: true,
      enum: ['especialidad', 'practica'],
    },
    estado: {
      type: String,
      required: true,
      trim: true,
      default: 'DISPONIBLE',
    },
    historialEstados: {
      type: [CambioEstadoTurnoSchema],
      required: false,
      default: [],
    },
    costo: {
      type: Number,
      required: true,
      default: null,
    },
    duracion: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'turnos',
  }
)

TurnoSchema.loadClass(Turno)

export const TurnoModel = mongoose.model('Turno', TurnoSchema)
