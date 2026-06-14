import mongoose from 'mongoose'
import { Turno } from '../models/turno.js'
import { MedicoSchema } from './medicoSchema.js'
import { PacienteSchema } from './pacienteSchema.js'
import { CambioEstadoTurnoSchema } from './cambioEstadoTurnoSchema.js'


export const TurnoSchema = new mongoose.Schema(
  {
    medico: {
      type: MedicoSchema,
      required: true,
    },
    paciente: {
      type: PacienteSchema,
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
      required: true
    },
    servicio: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      refPath: 'tipoDeServicio',
      required: true
    },

    tipoDeServicio: {
      type: String,
      required: true,
      enum: ['Especialidad', 'Practica']
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
      required: false,
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
