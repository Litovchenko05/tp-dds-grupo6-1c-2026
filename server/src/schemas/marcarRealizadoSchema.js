import { z } from 'zod'

export const marcarRealizadoSchema = z.object({
  estado: z.literal('REALIZADO'),
  notas: z.string().max(1000, 'Las notas no pueden exceder 1000 caracteres').optional().default(''),
})

