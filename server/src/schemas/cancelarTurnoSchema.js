import { z } from 'zod'

export const cancelarTurnoSchema = z.object({
  motivo: z
    .string()
    .min(1, 'El motivo es requerido')
    .max(500, 'El motivo no puede exceder 500 caracteres'),
})
