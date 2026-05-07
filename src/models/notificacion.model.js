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

    get id() {
        return this.#id;
    }

    get destinatario() {
        return this.#destinatario;
    }

    get remitente() {
        return this.#remitente;
    }

    get mensaje() {
        return this.#mensaje;
    }

    get fechaHoraCreacion() {
        return this.#fechaHoraCreacion;
    }

    get fechaHoraLeida() {
        return this.#fechaHoraLeida;
    }

    get leida() {
        return this.#leida;
    }

}