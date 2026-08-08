import { registroSchema } from '../validators/registro.schema.js'

export class AuthController {
  constructor({ authService }) {
    this.authService = authService
  }

  registrarUsuario = async (req, res) => {
    try {
      const resultado = registroSchema.safeParse(req.body)

      if (!resultado.success) {
        const errores = resultado.error.errors.map((err) => err.message)
        return res.status(400).json({ status: 'error', message: 'Error de validación', errores })
      }

      await this.authService.registrarUsuario(resultado.data)

      return res.status(201).json({ message: 'Usuario registrado con éxito en el sistema.' })
    } catch (e) {
      console.error('[AuthController] Error en registrarUsuario', {
        message: e?.message,
        stack: e?.stack,
        responseStatus: e?.response?.status,
        responseData: e?.response?.data,
      })

      if (e.response && e.response.status === 409) {
        return res.status(409).json({
          message: 'Error de validación',
          fields: { username: 'Este usuario ya existe. Por favor, probá con otro.' },
        })
      }
      if (e.field) {
        return res.status(409).json({
          message: 'Error de validación',
          fields: { [e.field]: e.message },
        })
      }
      return res
        .status(500)
        .json({ message: 'Ocurrió un error interno al procesar el registro que fue :' + e.message })
    }
  }

  obtenerPerfil = async (req, res) => {
    const requestId = req.requestId || 'no-request-id'

    try {
      console.info(`[AuthController][${requestId}] Inicio obtenerPerfil`, {
        usuarioMongoId: req.usuarioMongoId,
        usuarioRol: req.usuarioRol,
      })

      const perfil = await this.authService.obtenerPerfilDelUsuario(
        req.usuarioMongoId,
        req.usuarioRol,
        requestId
      )

      console.info(`[AuthController][${requestId}] Perfil obtenido correctamente`, {
        perfilKeys: perfil ? Object.keys(perfil) : [],
      })

      return res.status(200).json({
        status: 'success',
        data: perfil,
      })
    } catch (error) {
      console.error(`[AuthController][${requestId}] Error en obtenerPerfil`, {
        message: error?.message,
        stack: error?.stack,
        responseStatus: error?.response?.status,
        responseData: error?.response?.data,
      })

      return res.status(500).json({
        status: 'error',
        message: 'Error interno al obtener el perfil del usuario.',
      })
    }
  }

  obtenerPerfilDelUsuario = async (req, res) => this.obtenerPerfil(req, res)
}
