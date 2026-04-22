import {z} from 'zod';
import { especialidadSchema } from './especialidad.schema';
import { NivelDeCobertura } from '../models/nivelDeCobertura';
export const coberturaEspecialidadSchema = z.object ({
    especialidad: especialidadSchema,
    nivel: z.enum(Object.values(NivelDeCobertura))
});