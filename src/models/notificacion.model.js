import { notificacionSchema } from '../schemas/notificacion.schema.js'

export class Notificacion {

    #destinatario;
    #remitente;
    #mensaje;
    #fechaHoraCreacion;
    #fechaHoraLeida;
    #leida;

    constructor(data){
        const result = notificacionSchema.parse(data)

        this.#destinatario = result.destinatario
        this.#remitente = result.remitente
        this.#mensaje = result.mensaje
        this.#fechaHoraCreacion = result.fechaHoraCreacion
        this.#fechaHoraLeida = result.fechaHoraLeida
        this.#leida = result.leida
    }

    marcarComoLeida(){
        this.#leida = true
        this.#fechaHoraLeida = new Date()
    }
}