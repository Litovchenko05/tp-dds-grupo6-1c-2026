import { z } from 'zod'
import { diaSemanaSchema, horaSchema } from './horaDia.schema.js'
import { mongoIdSchema } from './mongoIdSchema.js'

export const nuevaDisponibilidadSchema = z
  .object({
    diaSemana: diaSemanaSchema.optional().nullable(),
    horaDesde: horaSchema.optional().nullable(),
    horaHasta: horaSchema.optional().nullable(),
    duracion: z.number().int().positive().optional().nullable(),
    costo: z.number().positive().optional().nullable(),
    sedeId: mongoIdSchema.optional().nullable(),
    servicioId: mongoIdSchema.optional().nullable(),
    tipoDeServicio: z.enum(['Especialidad', 'Practica']).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.horaDesde == null || data.horaHasta == null) return true
      return data.horaDesde < data.horaHasta
    },
    {
      message: 'HoraDesde debe ser menor que HoraHasta',
      path: ['horaHasta'],
    }
  )
