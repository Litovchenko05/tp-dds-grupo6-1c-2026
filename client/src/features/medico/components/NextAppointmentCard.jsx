import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// A reemplazar con datos reales o props
const mockTurno = {
  hora: '10:30',
  paciente: 'Juan Pérez',
  servicio: 'Clínica Médica',
  sede: 'Sede Central',
};

const NextAppointmentCard = ({ turno = mockTurno }) => (
  <Card elevation={3} sx={{ background: 'linear-gradient(90deg, #f7fafc, #dcefff)' }}>
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary">
        Próximo turno
      </Typography>
      <Box mt={1} mb={2} display="flex" alignItems="center">
        <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h5" fontWeight={700}>
          {turno.hora}
        </Typography>
      </Box>
      <Typography>
        Paciente: <strong>{turno.paciente}</strong>
      </Typography>
      <Typography>
        Servicio: <strong>{turno.servicio}</strong>
      </Typography>
      <Box display="flex" alignItems="center" mt={1}>
        <LocationOnIcon color="action" sx={{ mr: 0.5 }} />
        <Typography variant="body2">{turno.sede}</Typography>
      </Box>
      <Box mt={2} textAlign="right">
        <Button variant="contained" color="primary" href="/medico/agenda">
          Ir a Agenda
        </Button>
      </Box>
    </CardContent>
  </Card>
);

export default NextAppointmentCard;
