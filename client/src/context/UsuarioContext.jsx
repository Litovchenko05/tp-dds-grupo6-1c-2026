import { createContext, useContext, useState, useEffect, useCallback } from 'react' // ◄-- Importamos useCallback
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const UsuarioContext = createContext()

export const useUsuario = () => useContext(UsuarioContext)

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const navigate = useNavigate()

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    setUsuario(null)
    navigate('/login', { replace: true })
  }, [navigate])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUsuario({
          nombre: decoded.given_name || decoded.name || decoded.preferred_username,
          rol: decoded.realm_access?.roles?.includes('medico') ? 'medico' : 'paciente',
        })
      } catch (error) {
        console.error('Error al decodificar el token JWT', error)
        cerrarSesion()
      }
    }
  }, [cerrarSesion])

  return (
    <UsuarioContext.Provider value={{ usuario, cerrarSesion }}>{children}</UsuarioContext.Provider>
  )
}
