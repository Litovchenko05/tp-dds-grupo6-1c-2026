import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import apiClient from '../services/apiClient'

const UsuarioContext = createContext()

export const useUsuario = () => useContext(UsuarioContext)

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [cargandoUsuario, setCargandoUsuario] = useState(true)
  const navigate = useNavigate()

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    setUsuario(null)
    navigate('/login', { replace: true })
  }, [navigate])

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setCargandoUsuario(false)
      return
    }

    const cargarUsuario = async () => {
      const requestId = `fe-auth-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      try {
        console.info('[UsuarioContext] Inicio cargarUsuario', {
          requestId,
          hasToken: Boolean(token),
        })
        const decoded = jwtDecode(token)
        const nombre = decoded.given_name || decoded.name || decoded.preferred_username
        const rol = decoded.realm_access?.roles?.includes('medico') ? 'medico' : 'paciente'
        const username = decoded.preferred_username || ''

        console.info('[UsuarioContext] GET /auth/identificacion - request', { requestId })
        const response = await apiClient.get('/auth/identificacion', {
          headers: {
            'x-request-id': requestId,
          },
        })
        console.info('[UsuarioContext] GET /auth/identificacion - response', {
          requestId,
          status: response?.status,
        })

        const datosMongo = response.data.data || response.data

        setUsuario({
          idKeycloak: decoded.sub,
          _id: datosMongo.usuarioMongoId || datosMongo._id || decoded.sub,
          medicoId:
            datosMongo.medicoId ||
            datosMongo.medico?._id ||
            (rol === 'medico' ? datosMongo._id : null),
          pacienteId:
            datosMongo.pacienteId ||
            datosMongo.paciente?._id ||
            (rol === 'paciente' ? datosMongo._id : null),
          nombre,
          username,
          rol,
          matricula: datosMongo.matricula || null,
          dni: datosMongo.dni || null,
        })
        return
      } catch (error) {
        console.error('[UsuarioContext] Error al cargar el usuario', {
          requestId,
          message: error?.message,
          status: error?.response?.status,
          data: error?.response?.data,
        })
        cerrarSesion()
      } finally {
        console.info('[UsuarioContext] Fin cargarUsuario', { requestId })
        setCargandoUsuario(false)
      }
    }

    cargarUsuario()
  }, [cerrarSesion])

  return (
    <UsuarioContext.Provider value={{ usuario, cerrarSesion, cargandoUsuario }}>
      {children}
    </UsuarioContext.Provider>
  )
}
