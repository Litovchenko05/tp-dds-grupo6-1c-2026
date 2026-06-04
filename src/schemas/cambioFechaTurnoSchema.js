import { z } from 'zod'

export const crearCambioSchema = z.object({
  nuevaFecha: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), 'Nueva fecha debe ser una fecha válida'),
  nuevaHora: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'La hora debe estar en formato HH:mm'),
  motivo: z.string().max(500, 'El motivo no puede exceder 500 caracteres').optional(),
})

