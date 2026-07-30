import mongoose from 'mongoose'
import { Medico } from '../models/Medico.js'
import { DisponibilidadSchema } from '../schemasBD/disponibilidadSchema.js'
import { UsuarioSchema } from  '../schemasBD/usuarioSchema.js'

export const MedicoSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El ID de usuario es obligatorio'],
    },
    matricula: {
      type: String,
      required: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    practicas: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Practica',
      default: [],
    },
    especialidades: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Especialidad',
      default: [],
    },
    sedes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Sede',
      default: [],
    },
    disponibilidades: {
      type: [DisponibilidadSchema],
      default: [],
    }
  },
  {
    timestamps: true,
    collection: 'medicos',
  }
)

MedicoSchema.loadClass(Medico)
export const MedicoModel = mongoose.model('Medico', MedicoSchema)
