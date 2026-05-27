import { z } from 'zod'
import { practicaSchema } from './practica.schema'
import { NivelDeCobertura } from '../models/NivelDeCobertura'
export const coberturaPracticaSchema = z.object({
  practica: practicaSchema,
  nivel: z.enum(Object.values(NivelDeCobertura)),
})
