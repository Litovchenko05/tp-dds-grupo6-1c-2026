import { z } from 'zod'
import { EstadoTurnoSchema } from './estadoTurno.schema'

export const nuevoEstado = z.object({
    nuevoEstado: EstadoTurnoSchema,
    motivo: z.String()

})
