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
  } catch (error) {
    console.error('[AuthMiddleware][decodeJwtPart] Error al decodificar parte del JWT', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      responseStatus: error?.response?.status,
      responseData: error?.response?.data,
    })
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

  try {
    console.log('[AuthMiddleware][JWKS] URL consultada:', jwksUrl)

    const now = Date.now()
    if (!jwksCache.keys || now - jwksCache.fetchedAt > 10 * 60 * 1000) {
      const response = await fetch(jwksUrl)
      if (!response.ok) {
        throw new Error(
          `No se pudieron obtener las claves públicas de Keycloak (${response.status})`
        )
      }
      const data = await response.json()
      jwksCache.keys = data.keys || []
      jwksCache.fetchedAt = now
      console.log('[AuthMiddleware][JWKS] Descarga exitosa')
      console.log('[AuthMiddleware][JWKS] Cantidad de claves obtenidas:', jwksCache.keys.length)
    } else {
      console.log('[AuthMiddleware][JWKS] Se usan claves cacheadas')
      console.log('[AuthMiddleware][JWKS] Cantidad de claves en caché:', jwksCache.keys.length)
    }

    console.log('[AuthMiddleware][JWKS] kid buscado:', kid)
    const jwk = jwksCache.keys.find((k) => k.kid === kid)
    if (!jwk) {
      console.error('[AuthMiddleware][JWKS] No se encontró clave pública para el kid:', kid)
      throw new Error('No se encontró una clave pública válida para el token')
    }

    console.log('[AuthMiddleware][JWKS] Clave pública encontrada para el kid:', kid)
    return createPublicKey({ key: jwk, format: 'jwk' })
  } catch (error) {
    console.error('[AuthMiddleware][JWKS] Error al obtener/seleccionar clave pública', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      responseStatus: error?.response?.status,
      responseData: error?.response?.data,
    })
    throw error
  }
}

const verifyToken = async (token) => {
  try {
    const issuer = getExpectedIssuer()
    const audience = process.env.KEYCLOAK_AUDIENCE
    const jwksUrl = process.env.KEYCLOAK_JWKS_URL || `${issuer}/protocol/openid-connect/certs`

    console.log('[AuthMiddleware][verifyToken] KEYCLOAK_BASE_URL:', process.env.KEYCLOAK_BASE_URL)
    console.log('[AuthMiddleware][verifyToken] KEYCLOAK_REALM:', process.env.KEYCLOAK_REALM)
    console.log('[AuthMiddleware][verifyToken] Issuer esperado:', issuer)
    console.log('[AuthMiddleware][verifyToken] Audience esperada:', audience || '(no configurada)')
    console.log('[AuthMiddleware][verifyToken] JWKS URL:', jwksUrl)

    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Token JWT mal formado')
    }

    const header = decodeJwtPart(parts[0])
    if (!header?.kid) {
      throw new Error('Token JWT sin kid en header')
    }

    const publicKey = await getSigningKeyFromJwks(header.kid)

    const verifyOptions = {}
    if (issuer) verifyOptions.issuer = issuer
    if (audience) verifyOptions.audience = audience

    return jwt.verify(token, publicKey, verifyOptions)
  } catch (error) {
    console.error('[AuthMiddleware][verifyToken] Error al validar token', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      responseStatus: error?.response?.status,
      responseData: error?.response?.data,
    })
    throw error
  }
}

export const identificarUsuario = async (req, res, next) => {
  try {
    const requestId = req.requestId || 'no-request-id'
    console.log(`[AuthMiddleware][${requestId}] Inicio identificarUsuario`)
    const authHeader = req.headers.authorization
    console.log(
      `[AuthMiddleware][${requestId}] Authorization header presente:`,
      Boolean(authHeader)
    )

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error(
        `[AuthMiddleware][${requestId}] 401: Header Authorization ausente o no comienza con "Bearer "`
      )
      return res.status(401).json({ status: 'error', message: 'Acceso denegado: Token requerido' })
    }

    const token = authHeader.split(' ')[1]
    console.log(`[AuthMiddleware][${requestId}] Token (primeros 40 chars):`, token?.slice(0, 40))

    const decodedPayload = await verifyToken(token)
    console.log(`[AuthMiddleware][${requestId}] JWT validado correctamente`)
    console.log(`[AuthMiddleware][${requestId}] JWT sub:`, decodedPayload?.sub)
    console.log(`[AuthMiddleware][${requestId}] JWT iss:`, decodedPayload?.iss)
    console.log(`[AuthMiddleware][${requestId}] JWT aud:`, decodedPayload?.aud)
    console.log(
      `[AuthMiddleware][${requestId}] JWT preferred_username:`,
      decodedPayload?.preferred_username
    )
    console.log(
      `[AuthMiddleware][${requestId}] JWT realm_access.roles:`,
      decodedPayload?.realm_access?.roles
    )

    const keycloakId = decodedPayload?.sub
    const roles = decodedPayload?.realm_access?.roles ?? []
    const usuarioRol = roles.find((role) => role === 'medico' || role === 'paciente')

    if (!keycloakId) {
      console.error(`[AuthMiddleware][${requestId}] 401: Token sin claim sub`)
      return res
        .status(401)
        .json({ status: 'error', message: 'Token inválido: No contiene ID de usuario (sub)' })
    }

    console.log(`[AuthMiddleware][${requestId}] Buscando usuario Mongo por keycloakId:`, keycloakId)
    const usuario = await UsuarioModel.findOne({ keycloakId })
    console.log(
      `[AuthMiddleware][${requestId}] Resultado búsqueda Mongo - encontrado:`,
      Boolean(usuario)
    )
    console.log(`[AuthMiddleware][${requestId}] Usuario _id:`, usuario?._id)
    console.log(
      `[AuthMiddleware][${requestId}] Usuario keycloakId almacenado:`,
      usuario?.keycloakId
    )

    if (!usuario) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Usuario no encontrado en el sistema interno' })
    }

    req.usuarioMongoId = usuario._id
    req.usuarioRol = usuarioRol
    next()
  } catch (error) {
    const requestId = req.requestId || 'no-request-id'
    console.error(`[AuthMiddleware][${requestId}] 401: Error en identificarUsuario`, {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      responseStatus: error?.response?.status,
      responseData: error?.response?.data,
    })

    return res.status(401).json({
      status: 'error',
      message: 'Token inválido o expirado',
      code: `ERR_AUTH_${error.name?.toUpperCase?.() || 'UNKNOWN'}`,
    })
  }
}
