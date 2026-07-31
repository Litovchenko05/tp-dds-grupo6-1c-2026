import React from 'react';
import { Grid } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import DashboardCard from './DashboardCard';

// Mock data (a integrar con backend)
const mockStats = {
  turnosDia: 5,
  atendidosMes: 40,
  servicios: 3,
};

const StatsSection = ({ stats = mockStats }) => (
  <Grid container spacing={2}>
    <Grid item xs={12} sm={4}>
      <DashboardCard
        value={stats.turnosDia}
        label="Turnos del día"
        icon={<EventNoteIcon />}
        color="primary"
      />
    </Grid>
    <Grid item xs={12} sm={4}>
      <DashboardCard
        value={stats.atendidosMes}
        label="Atendidos este mes"
        icon={<CheckCircleIcon />}
        color="success.main"
      />
    </Grid>
    <Grid item xs={12} sm={4}>
      <DashboardCard
        value={stats.servicios}
        label="Servicios que ofrece"
        icon={<MedicalServicesIcon />}
        color="info.main"
      />
    </Grid>
  </Grid>
);

export default StatsSection;
