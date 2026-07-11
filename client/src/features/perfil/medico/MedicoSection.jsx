import React, { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField as MuiTextField,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { medicoService } from './medicoService'

const CATALOGO_SERVICIOS = [
  'Consulta Médica General',
  'Ecografía',
  'Control Post-Operatorio',
  'Chequeo Preventivo',
]
const DURACIONES_ESTABLECIDAS = ['15 min', '30 min', '45 min', '60 min']
const SEDES_PREDEFINIDAS = ['Palermo', 'Villa Urquiza']

export default function MedicoSection({ idMedico }) {
  const [servicios, setServicios] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  const [cargando, setCargando] = useState(false)

  const [servicioSeleccionado, setServicioSeleccionado] = useState('')
  const [duracionSeleccionada, setDuracionSeleccionada] = useState('')
  const [precioInput, setPrecioInput] = useState('')
  const [sedeSeleccionada, setSedeSeleccionada] = useState('')

  useEffect(() => {
    async function cargarServicios() {
      try {
        const data = await medicoService.obtenerServicios(idMedico)
        setServicios(data || [])
      } catch (error) {
        console.error('Error al cargar servicios:', error)
      }
    }
    if (idMedico) cargarServicios()
  }, [idMedico])

  const handleAbrirPopup = () => setOpenPopup(true)

  const handleCerrarPopup = () => {
    setOpenPopup(false)
    setServicioSeleccionado('')
    setDuracionSeleccionada('')
    setPrecioInput('')
    setSedeSeleccionada('')
  }

  const handleAddServicio = async (e) => {
    e.preventDefault()
    if (!servicioSeleccionado || !duracionSeleccionada || !precioInput || !sedeSeleccionada) return

    setCargando(true)
    try {
      const nuevoServicioData = {
        nombre: servicioSeleccionado,
        duracion: duracionSeleccionada,
        precio: Number(precioInput),
        sede: sedeSeleccionada,
      }
      const data = await medicoService.agregarServicio(idMedico, nuevoServicioData)
      setServicios((prev) => [...prev, data])
      handleCerrarPopup()
    } catch (error) {
      console.error('Error al agregar servicio:', error)
    } finally {
      setCargando(false)
    }
  }

  const handleDeleteServicio = async (idServicio) => {
    try {
      await medicoService.eliminarServicio(idMedico, idServicio)
      setServicios((prev) => prev.filter((s) => s._id !== idServicio))
    } catch (error) {
      console.error('Error al eliminar servicio:', error)
    }
  }

  return (
    <Paper className="profile-card-base">
      <Typography variant="h5" className="profile-section-title">
        Mis Servicios
      </Typography>
      <Typography variant="body2" className="profile-section-subtitle">
        Gestioná las especialidades, sedes y valores de las consultas que ofrecés.
      </Typography>

      <Box className="mb-xl">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="profile-btn-primary"
          onClick={handleAbrirPopup}
        >
          Ofrecer Nuevo Servicio
        </Button>
      </Box>

      <Box className="profile-services-list">
        {servicios.length === 0 ? (
          <p className="profile-empty-text">No tenés servicios registrados actualmente.</p>
        ) : (
          servicios.map((servicio) => (
            <div key={servicio._id} className="profile-service-item">
              <Box>
                <Typography variant="subtitle1" className="profile-service-name">
                  {servicio.nombre}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {servicio.sede} • {servicio.duracion} • ${servicio.precio}
                </Typography>
              </Box>
              <IconButton
                onClick={() => handleDeleteServicio(servicio._id)}
                className="profile-delete-btn"
                title="Eliminar prestación"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          ))
        )}
      </Box>

      <Dialog open={openPopup} onClose={handleCerrarPopup} fullWidth maxWidth="xs">
        <DialogTitle>Agregar Nueva Prestación</DialogTitle>
        <Box component="form" onSubmit={handleAddServicio}>
          <DialogContent className="popup-form-container">
            <FormControl fullWidth>
              <InputLabel id="select-servicio-label">Seleccionar Servicio</InputLabel>
              <Select
                labelId="select-servicio-label"
                value={servicioSeleccionado}
                label="Seleccionar Servicio"
                onChange={(e) => setServicioSeleccionado(e.target.value)}
                required
              >
                {CATALOGO_SERVICIOS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="select-duracion-label">Duración del Turno</InputLabel>
              <Select
                labelId="select-duracion-label"
                value={duracionSeleccionada}
                label="Duración del Turno"
                onChange={(e) => setDuracionSeleccionada(e.target.value)}
                required
              >
                {DURACIONES_ESTABLECIDAS.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <MuiTextField
              label="Precio de la Consulta ($)"
              type="number"
              value={precioInput}
              onChange={(e) => setPrecioInput(e.target.value)}
              required
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel id="select-sede-label">Sede de Atención</InputLabel>
              <Select
                labelId="select-sede-label"
                value={sedeSeleccionada}
                label="Sede de Atención"
                onChange={(e) => setSedeSeleccionada(e.target.value)}
                required
              >
                {SEDES_PREDEFINIDAS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCerrarPopup} color="inherit">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={cargando}
              className="profile-btn-primary"
            >
              Guardar
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Paper>
  )
}
