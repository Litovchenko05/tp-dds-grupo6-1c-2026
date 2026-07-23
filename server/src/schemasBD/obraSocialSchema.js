import { ObraSocial } from '../models/ObraSocial.js'
import { PlanSchema } from './planSchema.js'
import mongoose from "mongoose";

export const ObraSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    planes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required:true,
    },
  },
  {
    timestamps: true,
    collection: 'obrasSociales',
  }
)

ObraSchema.loadClass(ObraSocial)

export const ObraSocialModel = mongoose.model('ObraSocial', ObraSchema)
