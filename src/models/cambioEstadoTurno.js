import { cambioEstadoTurnoSchema } from '../schemas/cambioEstadoTurno.schema.js'

export class CambioEstadoTurno {
    #fechaHoraIngreso
    #estado
    #turno
    #usuario
    #motivo

    constructor(data) {
        const result = cambioEstadoTurnoSchema.parse(data); 
        this.#fechaHoraIngreso = result.fechaHoraIngreso;
        this.#estado = result.estado;
        this.#turno = result.turno;
        this.#usuario = result.usuario;
        this.#motivo = result.motivo;
    }
}