import mongoose from 'mongoose'
import { NivelDeCobertura } from '../models/NivelDeCobertura.js'

export const CoberturaEspecialidadSchema = new mongoose.Schema({
  especialidad: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },

  nivel: {
    type: String,
    enum: Object.values(NivelDeCobertura),
    required: true
  }
})