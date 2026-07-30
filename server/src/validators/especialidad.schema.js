import { z } from 'zod'
import { mongoIdSchema } from './mongoIdSchema.js'
export const especialidadSchema = z.object({
  // id: z.number().nonnegative(),
  nombre: z.string(),
  duracionTurnoEnMins: z.number().nonnegative(),
  costoConsulta: z.number().nonnegative(),
  sede: mongoIdSchema,
})
