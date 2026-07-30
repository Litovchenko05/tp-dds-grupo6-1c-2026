import mongoose from 'mongoose'
import { Plan } from '../models/Plan.js'

export const PlanSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    coberturasDeServicios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cobertura',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
)

PlanSchema.loadClass(Plan)
export const PlanModel = mongoose.model('Plan', PlanSchema)
