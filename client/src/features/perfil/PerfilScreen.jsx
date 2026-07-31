import React from 'react'
import { useUsuario } from '../../context/UsuarioContext.jsx'
import { Box, Typography, Divider, Paper, TextField } from '@mui/material'
import MedicoSection from './medico/MedicoSection.jsx'
import PacienteSection from './paciente/PacienteSection.jsx'
import './PerfilScreen.css'

export default function PerfilScreen() {
  const { usuario } = useUsuario()

  if (!usuario) {
    return <Box className="app-view-container">Cargando perfil...</Box>
  }

  return (
    <Box className="app-view-container">
      <Typography variant="h4" className="page-title">
        Mi Perfil
      </Typography>

      <Paper className="profile-card-base">
        <Typography variant="h5" className="profile-section-title">
          Datos Personales
        </Typography>

        <Box className="profile-data-row">
          <TextField
            label="Nombre"
            value={usuario.name || usuario.nombre || ''}
            InputProps={{ readOnly: true }}
            variant="outlined"
            className="profile-readonly-field"
          />

          <TextField
            label="Usuario"
            value={usuario.username || ''}
            InputProps={{ readOnly: true }}
            variant="outlined"
            className="profile-readonly-field"
          />

          {usuario.rol === 'medico' && (
            <TextField
              label="Matrícula"
              value={usuario.matricula || ''}
              InputProps={{ readOnly: true }}
              variant="outlined"
              className="profile-readonly-field"
            />
          )}

          {usuario.rol === 'paciente' && (
            <TextField
              label="DNI"
              value={usuario.dni || ''}
              InputProps={{ readOnly: true }}
              variant="outlined"
              className="profile-readonly-field"
            />
          )}
        </Box>
      </Paper>

      <Divider className="my-xl" />

      {usuario.rol === 'medico' && <MedicoSection idMedico={usuario.medicoId} />}
      {usuario.rol === 'paciente' && <PacienteSection idPaciente={usuario.pacienteId} />}
    </Box>
  )
}
