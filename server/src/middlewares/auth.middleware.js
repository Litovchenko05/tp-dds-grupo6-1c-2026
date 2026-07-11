import jwt from 'jsonwebtoken'
import { UsuarioModel } from '../schemasBD/usuarioSchema.js'

export const identificarUsuario = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'Acceso denegado: Token requerido' })
    }

    const token = authHeader.split(' ')[1]
    const decodedPayload = jwt.decode(token)
    const keycloakId = decodedPayload?.sub
    const roles = decodedPayload?.realm_access?.roles ?? []
    const usuarioRol = roles.find((role) => role === 'medico' || role === 'paciente')

    if (!keycloakId) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Token inválido: No contiene ID de usuario (sub)' })
    }

    const usuario = await UsuarioModel.findOne({ keycloakId: keycloakId })
    if (!usuario) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Usuario no encontrado en el sistema interno' })
    }

    req.usuarioMongoId = usuario._id
    req.usuarioRol = usuarioRol
    next()
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error interno de autenticación',
      code: `ERR_INTERNAL_${error.name.toUpperCase()}`,
    })
  }
}
