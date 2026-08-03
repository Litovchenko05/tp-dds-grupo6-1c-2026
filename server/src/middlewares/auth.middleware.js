import jwt from 'jsonwebtoken'
import { createPublicKey } from 'crypto'
import { UsuarioModel } from '../schemasBD/usuarioSchema.js'

const toBase64 = (value) => {
  const padding = '='.repeat((4 - (value.length % 4)) % 4)
  return (value + padding).replace(/-/g, '+').replace(/_/g, '/')
}

const decodeJwtPart = (part) => {
  try {
    return JSON.parse(Buffer.from(toBase64(part), 'base64').toString('utf-8'))
  } catch {
    return null
  }
}

const jwksCache = {
  keys: null,
  fetchedAt: 0,
}

const getExpectedIssuer = () => {
  const explicitIssuer = process.env.KEYCLOAK_ISSUER
  if (explicitIssuer) return explicitIssuer

  if (process.env.KEYCLOAK_BASE_URL && process.env.KEYCLOAK_REALM) {
    return `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}`
  }

  return null
}

const getSigningKeyFromJwks = async (kid) => {
  const jwksUrl =
    process.env.KEYCLOAK_JWKS_URL || `${getExpectedIssuer()}/protocol/openid-connect/certs`

  const now = Date.now()
  if (!jwksCache.keys || now - jwksCache.fetchedAt > 10 * 60 * 1000) {
    const response = await fetch(jwksUrl)
    if (!response.ok) {
      throw new Error(`No se pudieron obtener las claves públicas de Keycloak (${response.status})`)
    }
    const data = await response.json()
    jwksCache.keys = data.keys || []
    jwksCache.fetchedAt = now
  }

  const jwk = jwksCache.keys.find((k) => k.kid === kid)
  if (!jwk) {
    throw new Error('No se encontró una clave pública válida para el token')
  }

  return createPublicKey({ key: jwk, format: 'jwk' })
}

const verifyToken = async (token) => {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Token JWT mal formado')
  }

  const header = decodeJwtPart(parts[0])
  if (!header?.kid) {
    throw new Error('Token JWT sin kid en header')
  }

  const publicKey = await getSigningKeyFromJwks(header.kid)

  const issuer = getExpectedIssuer()
  const audience = process.env.KEYCLOAK_AUDIENCE

  const verifyOptions = {}
  if (issuer) verifyOptions.issuer = issuer
  if (audience) verifyOptions.audience = audience

  return jwt.verify(token, publicKey, verifyOptions)
}

export const identificarUsuario = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'Acceso denegado: Token requerido' })
    }

    const token = authHeader.split(' ')[1]
    const decodedPayload = await verifyToken(token)
    const keycloakId = decodedPayload?.sub
    const roles = decodedPayload?.realm_access?.roles ?? []
    const usuarioRol = roles.find((role) => role === 'medico' || role === 'paciente')

    if (!keycloakId) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Token inválido: No contiene ID de usuario (sub)' })
    }

    const usuario = await UsuarioModel.findOne({ keycloakId })
    if (!usuario) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Usuario no encontrado en el sistema interno' })
    }

    req.usuarioMongoId = usuario._id
    req.usuarioRol = usuarioRol
    next()
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido o expirado',
      code: `ERR_AUTH_${error.name?.toUpperCase?.() || 'UNKNOWN'}`,
    })
  }
}
