export class Plan {
  id
  nombre
  coberturasEspecialidad
  coberturasPractica

  constructor(nombre, coberturasEspecialidad, coberturasPractica) {
    this.nombre = nombre
    this.coberturasEspecialidad = coberturasEspecialidad
    this.coberturasPractica = coberturasPractica
  }

  obtenerCoberturaEspecialidad(especialidadBuscada) {
    const cobertura = this.coberturasEspecialidad.find(
      (especialidadEnLista) => especialidadEnLista.especialidad.id == especialidadBuscada.id
    )
    if (cobertura) {
      return cobertura.porcentajeDescuento
    } else {
      return null
    }
  }

  obtenerCoberturaPractica(practicaBuscada) {
    const cobertura = this.coberturasPractica.find(
      (practicaEnLista) => practicaEnLista.practica.id == practicaBuscada.id
    )
    if (cobertura) {
      return cobertura.porcentajeDescuento
    } else {
      return null
    }
  }
}
