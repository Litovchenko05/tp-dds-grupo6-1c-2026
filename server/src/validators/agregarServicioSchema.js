import { z } from 'zod'

export const agregarServicioSchema = z.object({
  servicioId: z.string().min(1, 'El ID del servicio es requerido'),
  tipo: z.enum(['especialidad', 'practica'], {
    errorMap: () => ({ message: 'El tipo debe ser "especialidad" o "practica"' }),
  }),
  costo: z.number().min(1, 'El costo debe ser mayor a 0'),
  duracion: z.number().min(10, 'La duracion debe ser de minimo 10 minutos'),
  sede: z.string().min(1, 'El ID la sede es requerido'),
})
