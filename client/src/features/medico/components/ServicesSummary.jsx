import React/* , { useEffect, useState } */ from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Button, Box } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

// Datos mock (reemplazar por fetch real cuando servicio esté disponible)
const mockServicios = [
  { nombre: 'Clínica Médica', especialidad: 'Medicina Interna' },
  { nombre: 'Electrocardiograma', especialidad: 'Cardiología' },
  { nombre: 'Controles de rutina', especialidad: 'General' },
];

const ServicesSummary = ({ servicios = mockServicios }) => (
  <Card elevation={2}>
    <CardContent>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Mis Servicios
      </Typography>
      <List dense>
        {servicios.map((s, idx) => (
          <ListItem key={idx}>
            <ListItemIcon>
              <LocalHospitalIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={s.nombre}
              secondary={s.especialidad}
            />
          </ListItem>
        ))}
      </List>
      <Box mt={2} textAlign="right">
        <Button variant="outlined" color="primary" href="/medico/servicios">Ir a Servicios</Button>
      </Box>
    </CardContent>
  </Card>
);

export default ServicesSummary;
