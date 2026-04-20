import {z} from 'zod';
//import {sedeSchema} from './sedeSchema.js';
//Schema de validacion
//para matriculas medicas provinciales y nacionales  MP012345 o MN0012334...
export const matriculaMedicaSchema = z.string()
  .regex(/^MP\d{5,7}$/i, 'MP + 5-7 dígitos (MP12345)')
  .transform(m => `MP${m.slice(2).padStart(5, '0').slice(0,7)}`.toUpperCase());

export const medicoSchema = z.object({
    id: z.number().int().positive(),
    usuario: z.object({}),
    matricula: matriculaMedicaSchema,
    nombre: z.string().trim().min(1, 'Debe tener nombre.'),
    especialidades: z.array(Object).optional().nullable(), //verificar si esta bien esto
    practicas: z.array(Object).optional().nullable(), // verificar si esta bien esto
    //sedes:z.array(sedeSchema),
    //disponibilidades:z.array(disponibilidadHorariaSchema.optional().nullable()).optional().nullable()
});