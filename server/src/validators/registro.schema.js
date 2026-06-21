import { z } from 'zod'

// Validaciones comunes para ambos roles
const baseRegistroSchema = z.object({
  username: z.string().min(4, 'El usuario debe tener al menos 4 caracteres'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  name: z.string().min(1, 'El nombre es obligatorio'),
})

// Unión discriminada basada en el campo 'role'
export const registroSchema = z.discriminatedUnion('role', [
  baseRegistroSchema.extend({
    role: z.literal('paciente'),
    dni: z.string().regex(/^\d{7,8}$/, 'El DNI debe tener 7 u 8 números, sin puntos'),
  }),
  baseRegistroSchema.extend({
    role: z.literal('medico'),
    matricula: z.string().min(4, 'Ingresá una matrícula válida'),
  }),
])
