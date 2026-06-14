import { usuarioSchema } from '../schemas/usuario.schema.js'

export class UsuarioController {
  constructor({ usuarioService }) {
    this.usuarioService = usuarioService
  }

  crear = async (req, res) => {
    try {
      const resultado = usuarioSchema.safeParse(req.body)

      if (!resultado.success) {
        return res.status(400).json({ status: 'error', message: resultado.error.message })
      }

      const usuarioCreado = await this.usuarioService.crearUsuario(resultado.data)

      return res.status(201).json({ status: 'success', data: usuarioCreado })
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message })
    }
  }
}
