import { z } from 'zod'

export const practicaSchema = z.object({
  // id: z.number().nonnegative(),
  codigo: z.string(),
  nombre: z.string(),
  duracionTurnoEnMins: z.number().nonnegative(),
  costo: z.number().nonnegative(),
})
