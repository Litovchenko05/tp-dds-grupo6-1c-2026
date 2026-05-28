import { z } from 'zod'
import { especialidadSchema } from './especialidad.schema.js'
import { NivelDeCobertura } from '../models/NivelDeCobertura.js'
export const coberturaEspecialidadSchema = z.object({
  especialidad: especialidadSchema,
  nivel: z.enum(Object.values(NivelDeCobertura)),
})
