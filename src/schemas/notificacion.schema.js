import { z } from 'zod'
import { usuarioSchema } from './usuario.schema.js'

export const notificacionSchema = z.object({
    id: z.string(),
    destinatario: usuarioSchema,
    remitente: usuarioSchema,
    mensaje: z.string().min(10),
    fechaHoraCreacion: z.date(),
    fechaHoraLeida: z.date(),
    leida: z.boolean()
})