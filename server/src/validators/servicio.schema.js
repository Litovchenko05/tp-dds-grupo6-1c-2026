import { z } from 'zod'

export const servicioSchema = z
  .object({
    practica: z.string().nullable().optional(),
    especialidad: z.string().nullable().optional(),
    duracionTurnoEnMins: z.number().nonnegative(),
    costo: z.number().nonnegative(),
  })
  .refine((servicio) => Boolean(servicio.practica) !== Boolean(servicio.especialidad), {
    message: 'El servicio debe tener exactamente una referencia: practica o especialidad',
  })