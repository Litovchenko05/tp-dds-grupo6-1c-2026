import { CoberturaEspecialidad} from "./coberturaEspecialidad";
import { CoberturaPractica } from "./coberturaPractica";
export class Plan{
 
    constructor(data){
        const { id, nombre, coberturasEspecialidad,coberturasPractica} = planSchema.parse(data);
        this.id = id;
        this.nombre = nombre;
        this.coberturasEspecialidad = coberturasEspecialidad;
        this.coberturasPractica =coberturasPractica;   
    }
    obtenerCoberturaEspecialidad(especialidadBuscada){
        const cobertura = this.coberturasEspecialidad.find(
           especialidadEnLista => especialidadEnLista.especialidad.id == especialidadBuscada.id
           )
        if (cobertura) {return cobertura.nivel;}
        else { return null;}
    }
    obtenerCoberturaPractica(practicaBuscada){
        const cobertura = this.coberturasPractica.find(
           practicaEnLista => practicaEnLista.practica.id == practicaBuscada.id
           )
        if (cobertura) {return cobertura.nivel;}
        else { return null;}
       
    }
}
