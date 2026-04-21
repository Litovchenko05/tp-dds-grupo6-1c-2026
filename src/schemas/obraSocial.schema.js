import { z } from 'zod';
import { PlanSchema } from './plan.schema';

export  const ObraSocialSchema = z.object({
   nombre: z.string().trim().min(1, 'nombre es obligatorio'), // Validación para nombre, el trim le saca los espacios al principio y al final, y el min(1) asegura que no esté vacío
   planes: z.array(PlanSchema).optional(), // Valida que planes sea un array de objetos que cumplen con el PlanSchema, y es opcional, no se si todas las obras tienen si o si un plan});
})