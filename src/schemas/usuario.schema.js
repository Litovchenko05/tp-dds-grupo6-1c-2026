import { z } from 'zod'

export const usuarioSchema = z.object({
  nombreUsuario: z.string(),
  password: z.string(),
})
