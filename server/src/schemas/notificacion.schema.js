import { z } from 'zod'

export const notificacionSchema = z.object({
  destinatarioId: z.string().min(1, 'El ID del destinatario es obligatorio'),
  remitenteId: z.string().min(1, 'El ID del remitente es obligatorio'),
  mensaje: z.string().trim().min(1, 'El mensaje no puede estar vacío'),
})
