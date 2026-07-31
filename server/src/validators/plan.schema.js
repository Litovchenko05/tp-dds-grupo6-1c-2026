import { z } from 'zod'
import { coberturaEspecialidadSchema } from './coberturaEspecialidad.schema.js'
import { coberturaPracticaSchema } from './coberturaPractica.schema.js'

export const PlanSchema = z.object({
  // id: z.number().int().positive().optional().nullable(), // Valida que el id sea un número entero positivo, y puede ser opcional o nulo
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  coberturasEspecialidad: z
    .array(coberturaEspecialidadSchema, {
      message: 'coberturasEspecialidad debe ser un array',
    })
    .optional()
    .nullable(),
  coberturasPractica: z
    .array(coberturaPracticaSchema, {
      message: 'coberturasPractica debe ser un array',
    })
    .optional()
    .nullable(),
})
