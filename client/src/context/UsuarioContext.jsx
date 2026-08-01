import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

const UsuarioContext = createContext()

export const useUsuario = () => useContext(UsuarioContext)

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [cargandoUsuario, setCargandoUsuario] = useState(true)
  const navigate = useNavigate()

  const isDevBypassEnabled = () => {
    const raw = (process.env.REACT_APP_DEV_BYPASS_AUTH || '').trim().toLowerCase()
    return ['true', '1', 'yes', 'y'].includes(raw)
  }

  const getDevMockUser = () => {
    const roleRaw = (process.env.REACT_APP_DEV_ROLE || 'paciente').trim().toLowerCase()
    const rol = roleRaw === 'medico' ? 'medico' : 'paciente'
    return rol === 'medico'
      ? { _id: process.env.REACT_APP_DEV_MEDICO_ID || null, nombre: 'Medico123', rol: 'medico' }
      : { nombre: 'Paciente123', rol: 'paciente' }
  }

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    setUsuario(null)
    navigate('/login', { replace: true })
  }, [navigate])

  useEffect(() => {
    if (isDevBypassEnabled()) {
      setUsuario(getDevMockUser())
      setCargandoUsuario(false)
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      setCargandoUsuario(false) // no hay token, no hay nada que esperar
      return
    }

    const cargarUsuario = async () => {
      try {
        const decoded = jwtDecode(token)
        const nombre = decoded.given_name || decoded.name || decoded.preferred_username
        const rol = decoded.realm_access?.roles?.includes('medico') ? 'medico' : 'paciente'
        const username = decoded.preferred_username || ''

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/identificacion`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const datosMongo = response.data.data || response.data

        setUsuario({
          idKeycloak: decoded.sub,
          _id: datosMongo.usuarioMongoId || datosMongo._id || decoded.sub,
          nombre,
          username,
          rol,
          matricula: datosMongo.matricula || null,
          dni: datosMongo.dni || null,
        })
        return
      } catch (error) {
        console.error('Error al cargar el usuario', error)
        cerrarSesion()
      } finally {
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
