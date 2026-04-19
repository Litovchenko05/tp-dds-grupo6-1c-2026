import { z } from "zod"; 

const especialidadSchema = z.object({
    id: z.number().nonnegative(),
    nombre: z.string(),
    duracionTurnoEnMins: z.number().nonnegative(),
    costoConsulta: z.number().nonnegative(),
});
