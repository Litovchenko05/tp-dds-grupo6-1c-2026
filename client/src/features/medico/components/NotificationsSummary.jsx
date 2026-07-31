import React/* , { useEffect, useState } */ from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Button, Box } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

// Mock data (a conectar con servicio real cuando esté disponible)
const mockNotificaciones = [
  { mensaje: 'Turno confirmado con Juan Pérez', fecha: 'hoy' },
  { mensaje: 'Nuevo turno solicitado', fecha: 'ayer' },
  { mensaje: 'Resultado de práctica disponible', fecha: '2 días atrás' },
];

const NotificationsSummary = ({ notificaciones = mockNotificaciones }) => (
  <Card elevation={2}>
    <CardContent>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Últimas notificaciones
      </Typography>
      <List dense>
        {notificaciones.map((n, idx) => (
          <ListItem key={idx}>
            <ListItemIcon>
              <NotificationsActiveIcon color={idx===0 ? 'primary' : 'action'} />
            </ListItemIcon>
            <ListItemText 
                primary={n.mensaje}
                secondary={n.fecha}
            />
          </ListItem>
        ))}
      </List>
      <Box mt={2} textAlign="right">
        <Button variant="outlined" color="primary" href="/medico/notificaciones">Ver todas</Button>
      </Box>
    </CardContent>
  </Card>
);

export default NotificationsSummary;
