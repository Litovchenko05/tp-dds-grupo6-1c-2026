import React, { useEffect, useState } from 'react'
import { useNotificaciones } from '../../context/NotificacionesContext'
import { Box, Typography, List, Paper, Tabs, Tab } from '@mui/material'
import NotificacionCard from './NotificacionCard.jsx'
import './NotificacionesScreen.css'

const NotificacionesScreen = () => {
  const { notificaciones, cargarNotificaciones, marcarComoLeida } = useNotificaciones()

  // Iniciamos por defecto en 'pendientes'
  const [filtroActual, setFiltroActual] = useState('pendientes')

  // Cuando carga el componente o cambia la pestaña, disparamos la petición a la API
  useEffect(() => {
    cargarNotificaciones(filtroActual)
  }, [cargarNotificaciones, filtroActual])

  const handleChangeFiltro = (event, nuevoFiltro) => {
    setFiltroActual(nuevoFiltro)
  }

  return (
    <Box className="notifications-container">
      <Typography variant="h4" className="notifications-title">
        Mis Notificaciones
      </Typography>

      {/* Ahora el componente Tabs se divide armónicamente en 2 mitades */}
      <Tabs
        value={filtroActual}
        onChange={handleChangeFiltro}
        className="notifications-tabs"
        variant="fullWidth"
      >
        <Tab label="Pendientes" value="pendientes" className="notification-tab" />
        <Tab label="Todas" value="todas" className="notification-tab" />
      </Tabs>

      {notificaciones.length === 0 ? (
        <Paper className="notifications-empty">
          <Typography className="notifications-empty-text">
            {filtroActual === 'pendientes' && '¡Al día! No tenés notificaciones pendientes.'}
            {filtroActual === 'todas' && 'No tenés notificaciones en tu historial.'}
          </Typography>
        </Paper>
      ) : (
        <List className="notifications-list">
          {notificaciones.map((notif) => (
            <NotificacionCard key={notif._id} notif={notif} marcarComoLeida={marcarComoLeida} />
          ))}
        </List>
      )}
    </Box>
  )
}

export default NotificacionesScreen
