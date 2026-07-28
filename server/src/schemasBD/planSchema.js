import mongoose from 'mongoose'
import { Plan } from '../models/Plan.js'
import { CoberturaSchema } from './coberturaSchema.js'

export const PlanSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    coberturas: {
      type: [CoberturaSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

PlanSchema.loadClass(Plan)
