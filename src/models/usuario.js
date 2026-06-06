export class Usuario {
  nombreUsuario
  password

  constructor({ nombreUsuario, password }) {
    this.nombreUsuario = nombreUsuario
    this.password = password
  }
}
