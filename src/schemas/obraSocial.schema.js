import { z } from 'zod';


// Schema de validación
 const ObraSocialSchema = z.object({
   nombre: z.string().trim().min(1, 'nombre es obligatorio'), // Validación para nombre, el trim le saca los espacios al principio y al final, y el min(1) asegura que no esté vacío
   planes: z.array(z.object({}).passthrough()).min(1, 'planes es obligatorio'), // Validación para planes, asegurando que sea un array recibiendo un objeto. Después planes valida
});
