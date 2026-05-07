export class PacienteRepository {
    #pacientes;

    constructor(datosIniciales = []) {
        this.#pacientes = [];
        this.cargar(datosIniciales);
    }

    guardar(paciente) {
        if (!paciente || paciente.id == null) {
            throw new Error('El paciente debe tener un id para guardarse en memoria');
        }

        const indiceExistente = this.#pacientes.findIndex((p) => p.id === paciente.id);

        if (indiceExistente >= 0) {
            this.#pacientes[indiceExistente] = paciente;
        } else {
            this.#pacientes.push(paciente);
        }

        return paciente;
    }

    obtenerTodos() {
        return [...this.#pacientes];
    }

    obtenerPorId(idPaciente) {
        return this.#pacientes.find((paciente) => paciente.id === idPaciente) ?? null;
    }

    obtenerPorDni(dni) {
        return this.#pacientes.find((paciente) => paciente.dni === dni) ?? null;
    }

    eliminarPorId(idPaciente) {
        const cantidadInicial = this.#pacientes.length;
        this.#pacientes = this.#pacientes.filter((paciente) => paciente.id !== idPaciente);
        return this.#pacientes.length < cantidadInicial;
    }

    limpiar() {
        this.#pacientes = [];
    }

    cargar(pacientes = []) {
        pacientes.forEach((paciente) => this.guardar(paciente));
    }
}
