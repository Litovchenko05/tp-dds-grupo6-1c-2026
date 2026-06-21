import { z } from 'zod'
import { practicaSchema } from './practica.schema.js'
import { NivelDeCobertura } from '../models/NivelDeCobertura.js'
export const coberturaPracticaSchema = z.object({
  practica: practicaSchema,
  nivel: z.enum(Object.values(NivelDeCobertura)),
})
