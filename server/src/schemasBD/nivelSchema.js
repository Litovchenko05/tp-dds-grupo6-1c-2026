import mongoose from 'mongoose'
import { NivelDeCobertura } from '../models/NivelDeCobertura.js'

export const NivelDeCoberturaSchema = new mongoose.Schema(
  {
    nivel: {
      type: String,
      enum: Object.values(NivelDeCobertura),
      required: true
    }
  }
)


export const NivelDeCoberturaModel = mongoose.model('NivelDeCobertura', NivelDeCoberturaSchema)