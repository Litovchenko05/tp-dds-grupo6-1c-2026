import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

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

    if (!token) return

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
      } catch (error) {
        console.error('Error al cargar el usuario', error)
        cerrarSesion()
      }
    }

    cargarUsuario()
  }, [cerrarSesion])

  return (
    <UsuarioContext.Provider value={{ usuario, cerrarSesion }}>{children}</UsuarioContext.Provider>
  )
}
