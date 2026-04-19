import { practicaSchema } from '../schemas/practica.schema.js'

export class Practica{

    constructor(data){
        const result = practicaSchema.parse(data)

        this.id = result.id;
        this.codigo = result.codigo;
        this.nombre = result.nombre;
        this.duracionTurnoEnMins = result.duracionTurnoEnMins;
        this.costo = result.costo;
    }

    
}

