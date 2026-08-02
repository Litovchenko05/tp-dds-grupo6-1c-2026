import { z } from 'zod'
import { mongoIdSchema } from './mongoIdSchema.js'

export const pacienteSchema = z.object({
  usuario: mongoIdSchema,
  dni: z.string().trim().min(1, 'dni es obligatorio'),
  nombre: z.string().trim().min(1, 'nombre es obligatorio'),
  obraSocial: mongoIdSchema, // Valida que la obra social cumpla con el schema de obra social
  plan: mongoIdSchema, // Valida que el plan cumpla con el schema de plan
})
