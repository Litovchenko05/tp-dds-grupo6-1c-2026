import { especialidadSchema } from '../schemas/especialidad.schema.js'

export class Especialidad {

    constructor(data){
        const result = especialidadSchema.parse(data)
        
        this.id = result.id;
        this.nombre = result.nombre;
        this.duracionTurnoEnMins = result.duracionTurnoEnMins;
        this.costoConsulta = result.costoConsulta;
    }
}