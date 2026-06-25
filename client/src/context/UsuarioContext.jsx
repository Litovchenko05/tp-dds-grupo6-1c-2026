import { createContext, useContext, useState, useEffect, useCallback } from 'react' // ◄-- Importamos useCallback
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const UsuarioContext = createContext()

export const useUsuario = () => useContext(UsuarioContext)

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const navigate = useNavigate()

  const isDevBypassEnabled = () => {
    const raw = (process.env.REACT_APP_DEV_BYPASS_AUTH || '').trim().toLowerCase()
    return ['true', '1', 'yes', 'y'].includes(raw)
  }

  const getDevMockUser = () => {
    const roleRaw = (process.env.REACT_APP_DEV_ROLE || 'paciente').trim().toLowerCase()
    const rol = roleRaw === 'medico' ? 'medico' : 'paciente'
    return rol === 'medico'
      ? { nombre: 'Medico123', rol: 'medico' }
      : { nombre: 'Paciente123', rol: 'paciente' }
  }

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    setUsuario(null)
    navigate('/login', { replace: true })
  }, [navigate])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const devBypass = isDevBypassEnabled()

    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUsuario({
          nombre: decoded.given_name || decoded.name || decoded.preferred_username,
          rol: decoded.realm_access?.roles?.includes('medico') ? 'medico' : 'paciente',
        })
        return
      } catch (error) {
        console.error('Error al decodificar el token JWT', error)
        if (!devBypass) {
          cerrarSesion()
          return
        }
      }
    }

    if (devBypass) {
      setUsuario(getDevMockUser())
    } else {
      setUsuario(null)
    }
  }, [cerrarSesion])

  return (
    <UsuarioContext.Provider value={{ usuario, cerrarSesion }}>{children}</UsuarioContext.Provider>
  )
}
