import mongoose from 'mongoose'
import { Cobertura } from '../models/cobertura.js'
import { NivelDeCobertura } from '../models/NivelDeCobertura.js'

export const CoberturaSchema = new mongoose.Schema(
  {
    servicio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Servicio',
      required: true,
    },
    nivel: {
      type: String,
      enum: Object.values(NivelDeCobertura),
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

CoberturaSchema.loadClass(Cobertura)
