import { Box, Typography, Paper, Button } from '@mui/material'
import './misTurnosPage.css'

const MisTurnosPage = () => {
  return (
    <Box className="app-view-container">
      <Typography variant="h4" className="page-title">
        Mis turnos
      </Typography>

      <Paper className="tarjeta-turno-reservado" elevation={0}>
        <div className="turno-encabezado">
          <span className="fecha">25 Mayo, 2026</span>
          <span className="estado-etiqueta reserva-activa">Reservado</span>
        </div>

        <div className="turno-cuerpo">
          <h3>Consulta con Pediatría</h3>
          <p>
            <strong>Médico:</strong> Dra. Violeta Martínez
          </p>
          <p>
            <strong>Sede:</strong> Av. Belgrano 950
          </p>
          <p>
            <strong>Hora:</strong> 10:00 hs
          </p>
          <p>
            <strong>Costo:</strong> $30.000
          </p>
        </div>

        <div className="contenedor-boton">
          <Button variant="contained" className="btn-cancelar" disableElevation>
            Cancelar turno
          </Button>
        </div>
      </Paper>

      <Paper className="tarjeta-turno-reservado" elevation={0}>
        <div className="turno-encabezado">
          <span className="fecha">25 Mayo, 2026</span>
          <span className="estado-etiqueta reserva-activa">Reservado</span>
        </div>

        <div className="turno-cuerpo">
          <h3>Consulta con Oftalmología</h3>
          <p>
            <strong>Médico:</strong> Dr. Javier Morales
          </p>
          <p>
            <strong>Sede:</strong> Av. Belgrano 950
          </p>
          <p>
            <strong>Hora:</strong> 08:00 hs
          </p>
          <p>
            <strong>Costo:</strong> $60.000
          </p>
        </div>

        <div className="contenedor-boton">
          <Button variant="contained" className="btn-cancelar" disableElevation>
            Cancelar turno
          </Button>
        </div>
      </Paper>
    </Box>
  )
}

export default MisTurnosPage
