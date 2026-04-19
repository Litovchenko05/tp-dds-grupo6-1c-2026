import {z} from 'zod';

//Schema de validacion
const sedeSchema = z.object({
    id: z.number().int().positive(), //validos: 1,2,3...
    nombre: z.string().trim().min(1, "El nombre es obligatorio"),
    direccion: z.string().trim().min(1, "La direccion es obligatoria"),
});

export class Sede{
    constructor(data){
        const {id,nombre, direccion} = sedeSchema.parse(data);
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
    }
}