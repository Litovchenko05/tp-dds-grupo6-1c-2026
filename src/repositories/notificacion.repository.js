export class NotificacionRepository {
    #notificaciones

    constructor(datosIniciales = []) {
        this.#notificaciones = []
        this.cargar(datosIniciales)
    }

    guardar(notificacion) {
        if (!notificacion || notificacion.id == null) {
            throw new Error('La notificacion debe tener un id para guardarse en memoria')
        }

        const indiceExistente = this.#notificaciones.findIndex((n) => n.id === notificacion.id)

        if (indiceExistente >= 0) {
            this.#notificaciones[indiceExistente] = notificacion
        } else {
            this.#notificaciones.push(notificacion)
        }

        return notificacion
    }

    obtenerTodos() {
        return [...this.#notificaciones]
    }

    obtenerPorId(idNotificacion) {
        return this.#notificaciones.find((notificacion) => notificacion.id === idNotificacion) ?? null
    }

    obtenerNoLeidas() {
        return this.#notificaciones.filter((notificacion) => !notificacion.leida)
    }

    obtenerLeidas() {
        return this.#notificaciones.filter((notificacion) => notificacion.leida)
    }

    eliminarPorId(idNotificacion) {
        const cantidadInicial = this.#notificaciones.length
        this.#notificaciones = this.#notificaciones.filter((notificacion) => notificacion.id !== idNotificacion)
        return this.#notificaciones.length < cantidadInicial
    }

    limpiar() {
        this.#notificaciones = []
    }

    cargar(notificaciones = []) {
        notificaciones.forEach((notificacion) => this.guardar(notificacion))
    }
}
