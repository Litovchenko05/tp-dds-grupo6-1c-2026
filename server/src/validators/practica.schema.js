import { z } from 'zod'
import { mongoIdSchema } from './mongoIdSchema.js'

export const practicaSchema = z.object({
  // id: z.number().nonnegative(),
  codigo: z.string(),
  nombre: z.string(),
  duracionTurnoEnMins: z.number().nonnegative(),
  costo: z.number().nonnegative(),
  sede: mongoIdSchema,
})
