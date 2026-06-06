import mongoose from "mongoose";
import { CoberturaPractica } from '../models/CoberturaPractica.js'
import { PracticaSchema } from './practicaSchema.js'
import { NivelDeCobertura } from '../models/NivelDeCobertura.js'

export const CoberturaPracticaSchema = new mongoose.Schema(
  {
    practica: {
      type: PracticaSchema,
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

CoberturaPracticaSchema.loadClass(CoberturaPractica)

export const CoberturaPracticaModel = mongoose.model('CoberturaPractica', CoberturaPracticaSchema)
