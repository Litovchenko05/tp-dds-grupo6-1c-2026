import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import apiClient from '../services/apiClient'

const NotificacionesContext = createContext()

export const useNotificaciones = () => useContext(NotificacionesContext)

export const NotificacionesProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([])
  const [noLeidas, setNoLeidas] = useState(0)

  const cargarNotificaciones = useCallback(async (filtro = 'pendientes') => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }

      let url = '/notificaciones'
      if (filtro === 'leidas') url += '?leida=true'
      if (filtro === 'pendientes') url += '?leida=false'

      const response = await apiClient.get(url, config)
      const data = response.data.data || []

      setNotificaciones(data)

      if (filtro === 'todas') {
        setNoLeidas(data.filter((notif) => notif.leida === false).length)
      } else if (filtro === 'pendientes') {
        setNoLeidas(data.length)
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      cargarNotificaciones('pendientes')
    }
  }, [cargarNotificaciones])

  const marcarComoLeida = async (idNotificacion) => {
    try {
      const token = localStorage.getItem('token')
      const config = { headers: { Authorization: `Bearer ${token}` } }

      await apiClient.put(`/notificaciones/${idNotificacion}/leida`, {}, config)

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
