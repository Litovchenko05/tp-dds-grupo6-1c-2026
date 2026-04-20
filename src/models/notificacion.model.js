export class Notificacion {

    static ultimoId = 0;

    #id
    #destinatario
    #remitente
    #mensaje
    #fechaHoraCreacion
    #fechaHoraLeida
    #leida

    constructor({ destinatario, remitente, mensaje}){

        this.#id = Notificacion.ultimoId++;
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