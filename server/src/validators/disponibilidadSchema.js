import { z } from 'zod'
import { diaSemanaSchema, horaSchema } from './horaDia.schema.js'
import { practicaSchema } from './practica.schema.js'
import { especialidadSchema } from './especialidad.schema.js'
import { sedeSchema } from './sede.schema.js';

export const disponibilidadDetalladaSchema = z.object({
  diaSemana: diaSemanaSchema,
  horaDesde: horaSchema,
  horaHasta: horaSchema,
  sede: sedeSchema,
  servicio: practicaSchema.or(especialidadSchema),
  tipoDeServicio: z.enum([
  'Especialidad',
  'Practica',
])
}).refine((data) => data.horaDesde < data.horaHasta, {
    message: 'HoraDesde debe ser menor que HoraHasta',
})
