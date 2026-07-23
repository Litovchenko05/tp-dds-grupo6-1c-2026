import { z } from 'zod'

export const mongoIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, {
    message: 'Id de MongoDB es invalido',
  });