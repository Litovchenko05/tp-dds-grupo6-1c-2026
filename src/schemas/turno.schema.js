 import { z } from 'zod';
 import { EstadoTurno } from '../models/estadoTurno.enum.js';
 export const turnoSchema = z.object({
    id: z.string().optional, // Valida que el id sea un string opcionable recibirlo
    medico: z.object({}), // solo chequea que sea un objeto, no su contenido. Lo valida medico
    paciente: z.object({}), // solo chequea que sea un objeto, no su contenido. Lo valida paciente
    fechaHora: z.date(), // Valida que fechaHora sea una fecha válida
    sede: z.object({}), // solo chequea que sea un objeto, no su contenido. Lo valida sede
    practica: z.object({}), // solo chequea que sea un objeto, no su contenido. Lo valida practica
    estado:z.nativeEnum(EstadoTurno), // Valida que el estado sea uno de los valores definidos en estadoTurno
    historialEstados: z.array(z.object({}).nullable()), // solo chequea que sea un array de objetos, no su contenido. Lo valida historialEstados)
    costo: z.number().int().positive() // Valida que el costo sea un número entero positivo
});
