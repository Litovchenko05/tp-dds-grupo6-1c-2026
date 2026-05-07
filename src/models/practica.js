export class Practica{
    #id
    #codigo
    #nombre
    #duracionTurnoEnMins
    #costo

    constructor(id, codigo, nombre, duracionTurnoEnMins, costo){
        this.#id = id;
        this.#codigo = codigo;
        this.#nombre = nombre;
        this.#duracionTurnoEnMins = duracionTurnoEnMins;
        this.#costo = costo;

    }

    get id() {
        return this.#id;
    }

    get codigo() {
        return this.#codigo;
    }

    get nombre() {
        return this.#nombre;
    }

    get duracionTurnoEnMins() {
        return this.#duracionTurnoEnMins;
    }

    get costo() {
        return this.#costo;
    }
}

