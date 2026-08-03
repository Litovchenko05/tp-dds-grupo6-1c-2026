import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

const UsuarioContext = createContext()

export const useUsuario = () => useContext(UsuarioContext)

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [cargandoUsuario, setCargandoUsuario] = useState(true)
  const navigate = useNavigate()

  const cargandoRef = useRef(false)

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    setUsuario(null)
    cargandoRef.current = false
    navigate('/login', { replace: true })
  }, [navigate])

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setCargandoUsuario(false)
      return
    }

    if (usuario || cargandoRef.current) {
      setCargandoUsuario(false)
      return
    }

    const cargarUsuario = async () => {
      cargandoRef.current = true

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
      } catch (error) {
        console.error('Error al cargar el usuario', error)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          cerrarSesion()
        }
      } finally {
        setCargandoUsuario(false)
      }
    }

    cargarUsuario()
  }, [cerrarSesion, usuario])

  return (
    <UsuarioContext.Provider value={{ usuario, cerrarSesion, cargandoUsuario }}>
      {children}
    </UsuarioContext.Provider>
  )
}
