import { z } from "zod"; 
import { usuarioSchema } from "./usuario.schema.js";
import { turnoSchema } from "./turno.schema.js";

export const cambioEstadoTurnoSchema = z.object({
    fechaHoraIngreso: z.coerce.date(), 
    estado: z.enum(["DISPONIBLE", "CONFIRMADO", "CANCELADO", "RESERVADO", "REALIZADO"]),
    turno: turnoSchema,
    usuario:  usuarioSchema,
    motivo: z.string()
});
