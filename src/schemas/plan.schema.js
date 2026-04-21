import { z } from "zod";

 export const PlanSchema = z.object({
  id: z.number().int().positive().optional().nullable(), // Valida que el id sea un número entero positivo, y puede ser opcional o nulo
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
});
