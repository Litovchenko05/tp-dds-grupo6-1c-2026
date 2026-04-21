import { z } from 'zod';
 const pacienteSchema = z.object({
    id: z.number().int().positive(), // Valida que el id sea un número entero positivo
   // usuario: UsuarioSchema, // Asumiendo que tienes un esquema para Usuario
    usuario: z.object({}), //
    dni: z.string().trim().min(1, 'dni es obligatorio'),
    nombre: z.string().trim().min(1, 'nombre es obligatorio'),
    obraSocial: z.object({}), // solo chequea que sea un objeto, no su contenido. Lo valida la cllase obrasocial
    plan: z.object({}), // solo chequea que sea un objeto, no su contenido. Lo valida plan

});