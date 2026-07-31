import React from 'react';
import DashboardBanner from '../components/DashboardBanner';
import NextAppointmentCard from '../components/NextAppointmentCard';
import StatsSection from '../components/StatsSection';
import ServicesSummary from '../components/ServicesSummary';
import NotificationsSummary from '../components/NotificationsSummary';
import { Box, Grid, Container } from '@mui/material';

const Dashboard = () => {
  return (
    <Container maxWidth="lg">
      <Box mt={3}>
        <DashboardBanner />
      </Box>
      <Box mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <NextAppointmentCard />
          </Grid>
          <Grid item xs={12} md={6}>
            <StatsSection />
          </Grid>
        </Grid>
      </Box>
      <Box mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ServicesSummary />
          </Grid>
          <Grid item xs={12} md={6}>
            <NotificationsSummary />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
