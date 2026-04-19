export class Notificacion {

    #id
    #destinatario
    #remitente
    #mensaje
    #fechaHoraCreacion
    #fechaHoraLeida
    #leida

    constructor({ id, destinatario, remitente, mensaje}){

        this.#id = id
        this.#destinatario = destinatario
        this.#remitente = remitente
        this.#mensaje = mensaje
        this.#fechaHoraCreacion = new Date()
        this.#fechaHoraLeida = null
        this.#leida = false
    }

    marcarComoLeida(){
        this.#leida = true
        this.#fechaHoraLeida = new Date()
    }
}