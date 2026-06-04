import { z } from 'zod'

export const agregarServicioSchema = z.object({
  servicioId: z.string().min(1, 'El ID del servicio es requerido'),
  tipo: z.enum(['especialidad', 'practica'], {
    errorMap: () => ({ message: 'El tipo debe ser "especialidad" o "practica"' }),
  }),
})
