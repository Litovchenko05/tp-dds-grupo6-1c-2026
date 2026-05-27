import { z } from 'zod'
import { usuarioSchema } from './usuario.schema.js'
import { especialidadSchema } from './especialidad.schema.js'
import { practicaSchema } from './practica.schema.js'
import {sedeSchema} from './sede.schema.js';
import { disponibilidadHorariaSchema } from './disponibilidadHoraria.schema.js'

//Schema de validacion
//para matriculas medicas provinciales y nacionales  MP012345 o MN0012334...
export const matriculaMedicaSchema = z
  .string()
  .regex(/^MP\d{5,7}$/i, 'MP + 5-7 dígitos (MP12345)')
  .transform((m) => `MP${m.slice(2).padStart(5, '0').slice(0, 7)}`.toUpperCase())

export const medicoSchema = z.object({
  // id: z.number().int().positive(),
  usuario: usuarioSchema,
  matricula: matriculaMedicaSchema,
  nombre: z.string().trim().min(1, 'Debe tener nombre.'),
  especialidades: z.array(especialidadSchema).optional().nullable(), // Verifica que sea un array de especialidades o null
  practicas: z.array(practicaSchema).optional().nullable(), // verificar que sea un array de prácticas o null
  sedes:z.array(sedeSchema),
  disponibilidades:z.array(disponibilidadHorariaSchema.optional().nullable()).optional().nullable()
})
