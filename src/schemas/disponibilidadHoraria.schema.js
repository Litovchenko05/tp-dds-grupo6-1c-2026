import {z} from 'zod';
import {diaSemanaSchema, horaSchema} from './horaDia.schema.js';

export const disponibilidadHorariaSchema = z.object({
    diaSemana: diaSemanaSchema,
    horaDesde: horaSchema, 
    horaHasta: horaSchema,
}).refine(
    (data)=> data.horaDesde<data.horaHasta, { message: 'HoraDesde debe ser menor que HoraHasta'}
);