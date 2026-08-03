import { z } from 'zod'
import { mongoIdSchema } from './mongoIdSchema.js'
export const especialidadSchema = z.object({
  // id: z.number().nonnegative(),
  nombre: z.string().optional().nullable(),
  duracionTurnoEnMins: z.number().nonnegative().optional().nullable(),
  costoConsulta: z.number().nonnegative().optional().nullable(),
  sede: mongoIdSchema.optional().nullable(),
})
