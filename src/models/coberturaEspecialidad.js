import { NivelDeCobertura } from './nivelDeCobertura'
export class CoberturaEspecialidad {
  #especialidad
  #nivel

  constructor(data) {
    const { especialidad, nivel } = coberturaEspecialidadSchema.parse(data)

    this.#especialidad = especialidad
    this.#nivel = nivel
  }
}
