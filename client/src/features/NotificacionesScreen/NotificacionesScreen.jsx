import React, { useEffect } from 'react'
import { useNotificaciones } from '../../context/NotificacionesContext'
import { Box, Typography, List, Paper } from '@mui/material'
import NotificacionCard from './NotificacionCard.jsx'
import './NotificacionesScreen.css'

const NotificacionesScreen = () => {
  const { notificaciones, cargarNotificaciones, marcarComoLeida } = useNotificaciones()

  useEffect(() => {
    cargarNotificaciones()
  }, [cargarNotificaciones])

  return (
    <Box className="notifications-container">
      <Typography variant="h4" className="notifications-title">
        Mis Notificaciones
      </Typography>

      {notificaciones.length === 0 ? (
        <Paper className="notifications-empty">
          <Typography className="notifications-empty-text">
            No tenés notificaciones nuevas.
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
