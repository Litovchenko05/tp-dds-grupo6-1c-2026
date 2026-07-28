import { z } from 'zod'
import { usuarioSchema } from './usuario.schema.js'
import { ObraSocialSchema } from './obraSocial.schema.js'
import { PlanSchema } from './plan.schema.js'
import { mongoIdSchema } from './mongoIdSchema.js'

export const pacienteSchema = z.object({
  // id: z.number().int().positive(), // Valida que el id sea un número entero positivo
  // usuario: usuarioSchema.optional().nullable(),// Valida que el usuario cumpla con el schema de usuario
  usuario: mongoIdSchema,
  dni: z.string().trim().min(1, 'dni es obligatorio'),
  nombre: z.string().trim().min(1, 'nombre es obligatorio'),
  obraSocial: mongoIdSchema, // Valida que la obra social cumpla con el schema de obra social 
  plan: mongoIdSchema, // Valida que el plan cumpla con el schema de plan
})
