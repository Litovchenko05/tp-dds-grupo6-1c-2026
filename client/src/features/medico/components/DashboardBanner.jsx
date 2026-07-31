import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
// import { getMedicoResumen } from '../services/medicoService'; // Descomentar cuando el servicio exista

const DashboardBanner = () => {
  // Estado: Datos reales cuando haya servicio
  // const [resumen, setResumen] = useState(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   getMedicoResumen().then(data => {
  //     setResumen(data);
  //     setLoading(false);
  //   });
  // }, []);

  // Datos mock
  const mockMedico = {
    nombre: 'Dra. Ana Méndez',
    resumen: 'Hoy tenés 5 turnos programados',
    avatar: '',
  };

  // if (loading) return <Skeleton variant="rectangular" height={96} />;

  return (
    <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', background: 'linear-gradient(90deg,#e0e7ef,#fff)' }}>
      <Avatar sx={{ width: 64, height: 64, mr: 2 }} src={mockMedico.avatar}>
        {mockMedico.nombre.charAt(0)}
      </Avatar>
      <Box>
        <Typography variant="h6" color="primary.main">Bienvenida</Typography>
        <Typography variant="h4" fontWeight={600}>{mockMedico.nombre}</Typography>
        <Typography color="text.secondary" mt={1}>{mockMedico.resumen}</Typography>
      </Box>
    </Paper>
  );
};

export default DashboardBanner;
