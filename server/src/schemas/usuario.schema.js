import { z } from 'zod'

export const usuarioSchema = z.object({
  nombreUsuario: z
    .string({
      required_error: 'El nombre de usuario es obligatorio',
      invalid_type_error: 'El nombre de usuario debe ser un texto',
    })
    .trim()
    .min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
    .max(20, { message: 'El nombre de usuario no puede superar los 20 caracteres' }),

  password: z
    .string({
      required_error: 'La contraseña es obligatoria',
    })
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
})
