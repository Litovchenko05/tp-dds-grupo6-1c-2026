import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const DashboardCard = ({ value, label, icon, color }) => (
  <Card elevation={2} sx={{ minHeight: 112 }}>
    <CardContent>
      <Box display="flex" alignItems="center">
        {icon && <Box mr={2} color={color}>{icon}</Box>}
        <Box>
          <Typography variant="h4" fontWeight={600} color={color || 'primary'}>
            {value}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default DashboardCard;
