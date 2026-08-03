import { DiasSemana } from './diaSemana.enum.js'
export class DisponibilidadHoraria {
  id
  diaSemana
  horaDesde
  horaHasta
  fueModificada

  constructor(diaSemana, horaDesde, horaHasta) {
    this.diaSemana = diaSemana
    this.horaDesde = horaDesde
    this.horaHasta = horaHasta
    this.fueModificada = false
  }

  getId() {
    return this.id
  }
  setId(id) {
    this.id = id
  }
  getDiaSemana() {
    return this.diaSemana
  }

  getHoraDesde() {
    return this.horaDesde
  }

  getHoraHasta() {
    return this.horaHasta
  }

  getFueModificada() {
    return this.fueModificada
  }

  actualizarDisponibilidad(diaSemana, horaDesde, horaHasta) {
    this.diaSemana = diaSemana
    this.horaDesde = horaDesde
    this.horaHasta = horaHasta
    this.fueModificada = true
  }

  obtenerNombreDelDiaDeSemana(indice) {
    return Object.keys(DiasSemana).find((key) => DiasSemana[key] === indice)
  }

  obtenerIndiceDelDiaDeSemana(nombreDia) {
    return DiasSemana[nombreDia]
  }
}
