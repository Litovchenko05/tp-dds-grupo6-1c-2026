import React, { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { pacienteService } from './pacienteService'

const OBRAS_SOCIALES = ['OSDE', 'Swiss Medical', 'Galeno', 'Medifé', 'Particular / Sin Obra Social']

export default function PacienteSection({ idPaciente }) {
  const [obrasSociales, setObrasSociales] = useState([])
  const [planes, setPlanes] = useState([])

  const [obraSocial, setObraSocial] = useState('')
  const [plan, setPlan] = useState('')
  const [cargando, setCargando] = useState(false)
  const [guardadoExitoso, setGuardadoExitoso] = useState(false)

  useEffect(() => {
    const cargarDatos = async () => {
      const [obrasSociales, planes] = await Promise.all([
        pacienteService.getObrasSociales(),
        pacienteService.getPlanes(),
      ])

      setObrasSociales(obrasSociales.data)
      setPlanes(planes.data)
    }
    cargarDatos()
  }, [])

  useEffect(() => {
    async function cargarCobertura() {
      try {
        const data = await pacienteService.obtenerCobertura(idPaciente)
        if (data) {
          setObraSocial(data.obraSocial || '')
          setPlan(data.plan || '')
        }
      } catch (error) {
        console.error('Error al cargar cobertura:', error)
      }
    }
    if (idPaciente) cargarCobertura()
  }, [idPaciente])

  const handleGuardar = async (e) => {
    e.preventDefault()
    setCargando(true)
    setGuardadoExitoso(false)

    try {
      await pacienteService.actualizarCobertura(idPaciente, { obraSocial, plan })
      setGuardadoExitoso(true)
    } catch (error) {
      console.error('Error al actualizar cobertura:', error)
    } finally {
      setCargando(false)
    }
  }

  return (
    <Paper className="profile-card-base">
      <Typography variant="h5" className="profile-section-title">
        Cobertura Médica
      </Typography>
      <Typography variant="body2" className="profile-section-subtitle">
        Declarar tu obra social y plan facilita la validación de tus turnos médicos.
      </Typography>

      <Box component="form" onSubmit={handleGuardar} className="profile-cobertura-form">
        <FormControl fullWidth className="mb-xl">
          <InputLabel id="obra-social-label">Obra Social / Prepaga</InputLabel>
          <Select
            labelId="obra-social-label"
            value={obraSocial}
            label="Obra Social / Prepaga"
            onChange={(e) => setObraSocial(e.target.value)}
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
          className="mb-xl"
          disabled={cargando || !obraSocial || obraSocial.includes('Particular')}
        >
          <InputLabel id="plan-label">Plan</InputLabel>
          <Select
            labelId="plan-label"
            value={plan}
            label="Plan"
            onChange={(e) => setPlan(e.target.value)}
          >
            {planes.map((plan) => (
              <MenuItem key={plan._id} value={plan._id}>
                {plan.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box className="profile-actions-container">
          <Button
            type="submit"
            variant="contained"
            disabled={cargando}
            startIcon={<SaveIcon />}
            className="profile-btn-primary"
          >
            Guardar Cambios
          </Button>

          {guardadoExitoso && (
            <Typography variant="body2" className="profile-success-text">
              ¡Cobertura actualizada con éxito!
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  )
}
