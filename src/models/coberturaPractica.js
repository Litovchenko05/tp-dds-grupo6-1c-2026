import { NivelDeCobertura } from './nivelDeCobertura'
export class CoberturaPractica {
  #practica
  #nivel

  constructor(data) {
    const { practica, nivel } = coberturaPracticaSchema.parse(data)

    this.#practica = practica
    this.#nivel = nivel
  }
}
