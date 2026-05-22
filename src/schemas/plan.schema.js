import { z } from 'zod'
import { coberturaEspecialidadSchema } from './coberturaEspecialidad.schema'
import { coberturaPracticaSchema } from './coberturaPractica.schema'

export const PlanSchema = z.object({
  id: z.number().int().positive().optional().nullable(), // Valida que el id sea un número entero positivo, y puede ser opcional o nulo
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  coberturasEspecialidad: z.array(coberturaEspecialidadSchema).optional().nullable(),
})
