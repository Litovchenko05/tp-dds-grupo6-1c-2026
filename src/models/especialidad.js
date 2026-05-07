import { especialidadSchema } from '../schemas/especialidad.schema.js'

export class Especialidad {
    #id
    #nombre
    #duracionTurnoEnMins
    #costoConsulta

    constructor(id, nombre, duracionTurnoEnMins, costoConsulta){
        this.#id = id;
        this.#nombre = nombre;
        this.#duracionTurnoEnMins = duracionTurnoEnMins;
        this.#costoConsulta = costoConsulta;
    }

    get id() {
        return this.#id;
    }

    get nombre() {
        return this.#nombre;
    }

    get duracionTurnoEnMins() {
        return this.#duracionTurnoEnMins;
    }

    get costoConsulta() {
        return this.#costoConsulta;
    }

    get costo(){
        return this.#costoConsulta; // para usar servicio y practica de forma polimorfica en turno
    }
}