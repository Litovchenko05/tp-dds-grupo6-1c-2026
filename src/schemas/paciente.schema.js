import { z } from 'zod'
import { usuarioSchema } from './usuario.schema.js'
import { ObraSocialSchema } from './obraSocial.schema.js'
import { PlanSchema } from './plan.schema.js'

export const pacienteSchema = z.object({
  // id: z.number().int().positive(), // Valida que el id sea un número entero positivo
  dni: z.string().trim().min(1, 'dni es obligatorio'),
  nombre: z.string().trim().min(1, 'nombre es obligatorio'),
  obraSocial: ObraSocialSchema, // Valida que la obra social cumpla con el schema de obra social
  usuario: usuarioSchema, // Valida que el usuario cumpla con el schema de usuario
  plan: PlanSchema, // Valida que el plan cumpla con el schema de plan
})
