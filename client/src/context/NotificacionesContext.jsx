import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const NotificacionesContext = createContext()

export const useNotificaciones = () => useContext(NotificacionesContext)

export const NotificacionesProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([])
  const [noLeidas, setNoLeidas] = useState(0)

  const cargarNotificaciones = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/notificaciones`, config)

      const data = response.data.data || []
      setNotificaciones(data)

      const cantidad = data.filter((notif) => notif.leida === false).length
      setNoLeidas(cantidad)
    } catch (error) {
      console.error('Error al cargar notificaciones:', error)
    }
  }, [])

  useEffect(() => {
    cargarNotificaciones()
  }, [cargarNotificaciones])

  const marcarComoLeida = async (idNotificacion) => {
    try {
      const token = localStorage.getItem('token')
      const config = { headers: { Authorization: `Bearer ${token}` } }

      await axios.put(
        `${process.env.REACT_APP_API_URL}/notificaciones/${idNotificacion}/leida`,
        {},
        config
      )

      setNotificaciones((prev) =>
        prev.map((n) => (n._id === idNotificacion ? { ...n, leida: true } : n))
      )
      setNoLeidas((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error al marcar como leída:', error)
    }
  }

  return (
    <NotificacionesContext.Provider
      value={{ notificaciones, noLeidas, cargarNotificaciones, marcarComoLeida }}
    >
      {children}
    </NotificacionesContext.Provider>
  )
}
