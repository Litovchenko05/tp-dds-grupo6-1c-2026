import mongoose from "mongoose";
import { Plan } from '../models/Plan.js'
import { CoberturaEspecialidadSchema } from './coberturaEspecialdadSchema.js'

export const PlanSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    coberturasEspecialidad: {
      type: [CoberturaEspecialidadSchema],
    },
    coberturasPractica: {
    type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    collection: 'planes',
  }
)

PlanSchema.loadClass(Plan)

export const PlanModel = mongoose.model('Plan', PlanSchema)
