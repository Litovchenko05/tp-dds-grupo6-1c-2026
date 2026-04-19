import {z} from 'zod';
export const diaSemanaSchema = z.enum(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO']);
export const DiaSemana = diaSemanaSchema.enum;