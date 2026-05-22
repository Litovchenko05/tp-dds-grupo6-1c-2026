import { usuarioSchema } from '../schemas/usuario.schema.js'

export class Usuario {
  #id
  #nombreUsuario
  #password

  constructor({ id, nombreUsuario, password }) {
    this.#id = id
    this.#nombreUsuario = nombreUsuario
    this.#password = password
  }
}
