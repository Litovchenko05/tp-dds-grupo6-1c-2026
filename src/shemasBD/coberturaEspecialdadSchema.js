import mongoose from "mongoose";
import { CoberturaEspecialidad } from '../models/CoberturaEspecialidad.js'
import { EspecialidadSchema } from './especialidadSchema.js'
import { NivelDeCobertura } from '../models/NivelDeCobertura.js'

export const CoberturaEspecialidadSchema = new mongoose.Schema(
  {
    especialidad: {
      type: EspecialidadSchema,
      required: true,
     
    },
    nivel: {
      type: String,
      enum: Object.values(NivelDeCobertura),
      required: true
    },
  },
  {
    timestamps: true,
    
  }
)

CoberturaEspecialidadSchema.loadClass(CoberturaEspecialidad)

export const CoberturaEspecialidadModel = mongoose.model('CoberturaEspecialidad', CoberturaEspecialidadSchema)
