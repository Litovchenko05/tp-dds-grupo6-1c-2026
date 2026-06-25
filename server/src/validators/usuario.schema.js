import { z } from 'zod'

export const usuarioSchema = z.object({
  username: z
    .string({
      required_error: 'El nombre de usuario es obligatorio',
      invalid_type_error: 'El nombre de usuario debe ser un texto',
    })
    .trim()
    .min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
    .max(20, { message: 'El nombre de usuario no puede superar los 20 caracteres' }),

  keycloakId: z
    .string({
      required_error: 'El ID de Keycloak es obligatorio',
      invalid_type_error: 'El ID de Keycloak debe ser un texto',
    })
    .trim()
    .min(1, { message: 'El ID de Keycloak no puede estar vacío' }),
})
