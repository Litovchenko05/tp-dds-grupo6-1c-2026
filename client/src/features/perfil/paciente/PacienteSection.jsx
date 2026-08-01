import React from 'react'
import {
  Paper,
  Typography,
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Alert,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import { usePacienteSection } from './usePacienteSection'

export default function PacienteSection({ idPaciente }) {
  const {
    obrasSociales,
    coberturaGuardada,
    obraSocial,
    plan,
    setPlan,
    cargando,
    guardadoExitoso,
    planesDisponibles,
    nombreObraSocialGuardada,
    nombrePlanGuardado,
    handleObraSocialChange,
    handleGuardar,
  } = usePacienteSection(idPaciente)

  return (
    <Paper className="profile-card-base">
      <Typography variant="h5" className="profile-section-title">
        Cobertura Médica
      </Typography>
      <Typography variant="body2" className="profile-section-subtitle">
        Declarar tu obra social y plan facilita la validación de tus turnos médicos.
      </Typography>

      {coberturaGuardada ? (
        <Box className="cobertura-card-active">
          <Stack direction="row" alignItems="center" spacing={2}>
            <HealthAndSafetyIcon color="primary" className="cobertura-card-icon" />
            <Box flexGrow={1}>
              <Typography variant="subtitle1" className="profile-text-bold">
                {nombreObraSocialGuardada || 'Obra Social Registrada'}
              </Typography>
              {nombrePlanGuardado && (
                <Chip
                  label={`Plan: ${nombrePlanGuardado}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  className="profile-chip"
                />
              )}
            </Box>
          </Stack>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleGuardar} className="cobertura-form-container">
          <Alert severity="info" className="cobertura-alert">
            Una vez guardada tu cobertura médica, no podrá ser modificada por este medio.
          </Alert>

          <FormControl fullWidth margin="dense" className="cobertura-form-control">
            <InputLabel id="obra-social-label">Obra Social / Prepaga</InputLabel>
            <Select
              labelId="obra-social-label"
              value={obraSocial}
              label="Obra Social / Prepaga"
              onChange={handleObraSocialChange}
              disabled={cargando}
            >
              {obrasSociales.map((os) => (
                <MenuItem key={os._id} value={os._id}>
                  {os.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            margin="dense"
            className="cobertura-form-control-large"
            disabled={cargando || !obraSocial || planesDisponibles.length === 0}
          >
            <InputLabel id="plan-label">
              {planesDisponibles.length === 0 && obraSocial ? 'Sin planes disponibles' : 'Plan'}
            </InputLabel>
            <Select
              labelId="plan-label"
              value={plan}
              label={
                planesDisponibles.length === 0 && obraSocial ? 'Sin planes disponibles' : 'Plan'
              }
              onChange={(e) => setPlan(e.target.value)}
              MenuProps={{
                PaperProps: {
                  className: 'select-menu-paper',
                },
              }}
            >
              {planesDisponibles.map((p) => (
                <MenuItem key={p._id} value={p._id}>
                  {p.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            disabled={cargando || !obraSocial}
            startIcon={<SaveIcon />}
            className="profile-btn-primary"
          >
            Confirmar Cobertura
          </Button>
        </Box>
      )}

      {guardadoExitoso && (
        <Typography variant="body2" className="cobertura-success-text">
          ¡Cobertura registrada con éxito!
        </Typography>
      )}
    </Paper>
  )
}
