import { registroSchema } from '../schemas/registro.schema.js'

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
      return res.status(500).json({ message: 'Ocurrió un error interno al procesar el registro.' })
    }
  }
}
