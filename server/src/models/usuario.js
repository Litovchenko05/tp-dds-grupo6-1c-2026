export class Usuario {
  username
  keycloakId

  constructor({ username, keycloakId }) {
    this.username = username
    this.keycloakId = keycloakId
  }
}
