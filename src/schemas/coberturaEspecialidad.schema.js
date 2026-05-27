import { z } from 'zod'
import { especialidadSchema } from './especialidad.schema'
import { NivelDeCobertura } from '../models/NivelDeCobertura'
export const coberturaEspecialidadSchema = z.object({
  especialidad: especialidadSchema,
  nivel: z.enum(Object.values(NivelDeCobertura)),
})
