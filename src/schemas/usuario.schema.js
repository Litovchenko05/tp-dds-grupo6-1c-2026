import { z } from 'zod'

export const usuarioSchema = z.object({
    id: z.string(),
    nombreUsuario: z.string(),
    password: z.string()
})