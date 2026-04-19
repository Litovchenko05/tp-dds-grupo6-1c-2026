import { z } from "zod"; 

const practicaSchema = z.object({
    id: z.number().nonnegative(),
    codigo: z.string(),
    nombre: z.string(),
    duracionTurnoEnMins: z.number().nonnegative(),
    costo: z.number().nonnegative(),
});
