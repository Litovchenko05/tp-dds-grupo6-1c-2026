export class MedicoRepository {
    #medicos;

    constructor(datosIniciales = []) {
        this.#medicos = [];
        this.cargar(datosIniciales);
    }

    guardar(medico) {
        if (!medico || medico.id == null) {
            throw new Error('El medico debe tener un id para guardarse en memoria');
        }

        const indiceExistente = this.#medicos.findIndex((m) => m.id === medico.id);

        if (indiceExistente >= 0) {
            this.#medicos[indiceExistente] = medico;
        } else {
            this.#medicos.push(medico);
        }

        return medico;
    }

    obtenerTodos() {
        return [...this.#medicos];
    }

    obtenerPorId(idMedico) {
        return this.#medicos.find((medico) => medico.id === idMedico) ?? null;
    }

    eliminarPorId(idMedico) {
        const cantidadInicial = this.#medicos.length;
        this.#medicos = this.#medicos.filter((medico) => medico.id !== idMedico);
        return this.#medicos.length < cantidadInicial;
    }

    limpiar() {
        this.#medicos = [];
    }

    cargar(medicos = []) {
        medicos.forEach((medico) => this.guardar(medico));
    }
}
