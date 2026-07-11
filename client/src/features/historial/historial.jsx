import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import './historial.css'

const HistorialTurnosPage = () => {
  return (
    <Box className="app-view-container">
      <Typography variant="h4" className="page-title">
        Historial de Turnos
      </Typography>

      <Paper className="tarjeta-turno completado" elevation={0}>
        <div className="turno-encabezado">
          <span className="fecha">15 Mayo, 2026</span>
          <span className="estado etiqueta-completado">Realizado</span>
        </div>
        <div className="turno-cuerpo">
          <h3>Consulta con Cardiología</h3>
          <p>
            <strong>Médico:</strong> Dra. Violeta Martínez
          </p>
          <p>
            <strong>Sede:</strong> Av. Callao 850
          </p>
          <p>
            <strong>Hora:</strong> 10:00 hs
          </p>
          <p>
            <strong>Costo:</strong> $30.000
          </p>
        </div>
      </Paper>

      <Paper className="tarjeta-turno cancelado" elevation={0}>
        <div className="turno-encabezado">
          <span className="fecha">22 Abril, 2026</span>
          <span className="estado etiqueta-cancelado">Cancelado</span>
        </div>
        <div className="turno-cuerpo">
          <h3>Consulta con Ginecología</h3>
          <p>
            <strong>Médico:</strong> Dra. Estelea Rosas
          </p>
          <p>
            <strong>Sede:</strong> Av. Callao 850
          </p>
          <p>
            <strong>Hora:</strong> 11:00 hs
          </p>
          <p>
            <strong>Costo:</strong> $40.000
          </p>
        </div>
      </Paper>
    </Box>
  )
}

export default HistorialTurnosPage
