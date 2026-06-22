import { z } from 'zod'
import { diaSemanaSchema, horaSchema } from './horaDia.schema.js'
import { practicaSchema } from './practica.schema.js'
import { especialidadSchema } from './especialidad.schema.js'
import { disponibilidadHorariaSchema } from './disponibilidadHoraria.schema.js';
import { sedeSchema } from './sede.schema.js';

export const disponibilidadDetalladaSchema = z.object({
  disponibilidadHoraria: disponibilidadHorariaSchema,
  sede: sedeSchema,
  servicio: practicaSchema.or(especialidadSchema),
  tipoDeServicio: z.enum([
  'Especialidad',
  'Practica',
])
})
