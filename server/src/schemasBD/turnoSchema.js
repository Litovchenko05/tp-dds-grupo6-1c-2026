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
    practica: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Practica',
      default: null,
    },
    especialidad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Especialidad',
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
  },
  {
    timestamps: true,
    collection: 'turnos',
  }
)

TurnoSchema.pre('validate', function (next) {
  const tienePractica = this.practica != null
  const tieneEspecialidad = this.especialidad != null

  if (tienePractica === tieneEspecialidad) {
    next(new Error('El turno debe tener exactamente una referencia: practica o especialidad'))
    return
  }

  next()
})

TurnoSchema.loadClass(Turno)

export const TurnoModel = mongoose.model('Turno', TurnoSchema)
