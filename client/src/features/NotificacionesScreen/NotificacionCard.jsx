import React from 'react'
import { Paper, Box, Typography, IconButton } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'

const NotificacionCard = ({ notif, marcarComoLeida }) => {
  const esLeida = notif.leida

  return (
    <Paper
      elevation={esLeida ? 1 : 3}
      className={`notification-card ${esLeida ? 'read' : 'unread'}`}
    >
      <Box className="notification-content-box">
        {esLeida ? (
          <CheckCircleOutlineIcon className="notification-status-icon read" />
        ) : (
          <NotificationsActiveIcon className="notification-status-icon unread" />
        )}

        <Box>
          <Typography className={`notification-text ${esLeida ? 'read' : 'unread'}`}>
            {notif.mensaje}
          </Typography>
        </Box>
      </Box>
      {!esLeida && (
        <IconButton
          onClick={() => marcarComoLeida(notif._id)}
          title="Marcar como leída"
          className="read-action-btn"
        >
          <CheckCircleOutlineIcon />
        </IconButton>
      )}
    </Paper>
  )
}

export default NotificacionCard
