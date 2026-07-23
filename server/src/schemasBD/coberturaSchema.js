import mongoose from "mongoose";
import { Cobertura } from '../models/Cobertura.js'
import { NivelDeCobertura } from '../models/NivelDeCobertura.js'
import { NivelDeCoberturaSchema } from "./nivelSchema.js";

export const CoberturaSchema = new mongoose.Schema(
  {
    servicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Servicio',
    },
    nivel: {
      type: NivelDeCoberturaSchema,
      required: true
    },
  },
  {
    timestamps: true,
    collection: 'coberturas',
    
  }
)

CoberturaSchema.loadClass(Cobertura)

export const CoberturaModel = mongoose.model('Cobertura', CoberturaSchema)
