import { z } from 'zod'
import { EstadoTurnoSchema } from './estadoTurno.schema.js'

export const nuevoEstadoTurno = z.object({
    nuevoEstado: EstadoTurnoSchema,
    motivo: z.string().trim()

})
