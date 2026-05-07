
export class Sede{
    #id
    #nombre
    #direccion

    constructor(idSede, nombreSede, direccionSede){
        this.#id = idSede;
        this.#nombre = nombreSede;
        this.#direccion = direccionSede;
    }

    get id() {
        return this.#id;
    }

    get nombre() {
        return this.#nombre;
    }

    get direccion() {
        return this.#direccion;
    }
}