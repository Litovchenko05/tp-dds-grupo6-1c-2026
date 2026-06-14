import { UsuarioRepository } from '../repositories/usuario.repository.js'

export class UsuarioService {
  constructor({ usuarioRepository } = {}) {
    this.usuarioRepository = usuarioRepository ?? new UsuarioRepository()
  }

  async crearUsuario(usuario) {
    if (!usuario) {
      throw new Error('El usuario es obligatorio')
    }

    return await this.usuarioRepository.save(usuario)
  }
}
