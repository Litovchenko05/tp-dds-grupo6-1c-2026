import { z } from 'zod'
import { usuarioSchema } from './usuario.schema.js'
import { sedeSchema } from './sede.schema.js'

//para matriculas medicas provinciales y nacionales  MP012345 o MN0012334...
export const matriculaMedicaSchema = z
  .string()
  .regex(/^MP\d{5,7}$/i, 'MP + 5-7 dígitos (MP12345)')
  .transform((m) => `MP${m.slice(2).padStart(5, '0').slice(0, 7)}`.toUpperCase())

export const medicoSchema = z.object({
  usuario: usuarioSchema,
  matricula: matriculaMedicaSchema,
  nombre: z.string().trim().min(1, 'Debe tener nombre.'),
  sedes: z.array(sedeSchema),
})
