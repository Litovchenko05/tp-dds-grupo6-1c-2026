import React from 'react'
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
  Divider,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useMedicoSection } from './useMedicoSection'

const DURACIONES_ESTABLECIDAS = ['15 min', '30 min', '45 min', '60 min']
const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function MedicoSection({ idMedico }) {
  const {
    servicios,
    sedes,
    serviciosFiltrados,
    openPopup,
    cargando,
    tipoSeleccionado,
    setTipoSeleccionado,
    servicioObjeto,
    setServicioObjeto,
    duracionSeleccionada,
    setDuracionSeleccionada,
    precioInput,
    setPrecioInput,
    sedeObjeto,
    setSedeObjeto,
    diaSemana,
    setDiaSemana,
    horaDesde,
    setHoraDesde,
    horaHasta,
    setHoraHasta,
    handleAbrirPopup,
    handleCerrarPopup,
    handleAddServicioYDisponibilidad,
    handleDeleteServicio,
  } = useMedicoSection(idMedico)

  return (
    <Paper className="profile-card-base">
      <Typography variant="h5" className="profile-section-title">
        Mis Servicios y Horarios
      </Typography>
      <Typography variant="body2" className="profile-section-subtitle">
        Gestioná las prestaciones médicas que ofrecés y configurá sus agendas de atención.
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
        <DialogTitle>Agregar Servicio y Disponibilidad</DialogTitle>
        <Box component="form" onSubmit={handleAddServicioYDisponibilidad}>
          <DialogContent className="popup-form-container">
            <FormControl fullWidth required>
              <InputLabel id="select-tipo-label">Tipo de Servicio</InputLabel>
              <Select
                labelId="select-tipo-label"
                value={tipoSeleccionado}
                label="Tipo de Servicio"
                onChange={(e) => {
                  setTipoSeleccionado(e.target.value)
                  setServicioObjeto(null)
                }}
              >
                <MenuItem value="Especialidad">Especialidad</MenuItem>
                <MenuItem value="Practica">Práctica</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth required disabled={!tipoSeleccionado}>
              <InputLabel id="select-servicio-label">Seleccionar Servicio</InputLabel>
              <Select
                labelId="select-servicio-label"
                value={servicioObjeto ? servicioObjeto._id : ''}
                label="Seleccionar Servicio"
                onChange={(e) => {
                  const seleccionado = serviciosFiltrados.find((s) => s._id === e.target.value)
                  setServicioObjeto(seleccionado)
                }}
              >
                {serviciosFiltrados.map((s) => (
                  <MenuItem key={s._id} value={s._id}>
                    {s.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel id="select-duracion-label">Duración del Turno</InputLabel>
              <Select
                labelId="select-duracion-label"
                value={duracionSeleccionada}
                label="Duración del Turno"
                onChange={(e) => setDuracionSeleccionada(e.target.value)}
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

            <FormControl fullWidth required>
              <InputLabel id="select-sede-label">Sede de Atención</InputLabel>
              <Select
                labelId="select-sede-label"
                value={sedeObjeto ? sedeObjeto._id : ''}
                label="Sede de Atención"
                onChange={(e) => {
                  const encontrada = sedes.find((s) => s._id === e.target.value)
                  setSedeObjeto(encontrada)
                }}
              >
                {sedes.map((s) => (
                  <MenuItem key={s._id} value={s._id}>
                    {s.nombre} - {s.direccion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider className="my-md" />

            <Typography variant="subtitle2" color="primary">
              Horario de Atención
            </Typography>

            <FormControl fullWidth required>
              <InputLabel id="select-dia-label">Día de la Semana</InputLabel>
              <Select
                labelId="select-dia-label"
                value={diaSemana}
                label="Día de la Semana"
                onChange={(e) => setDiaSemana(e.target.value)}
              >
                {DIAS_SEMANA.map((dia) => (
                  <MenuItem key={dia} value={dia}>
                    {dia}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box display="flex" gap="var(--spacing-md)">
              <MuiTextField
                label="Hora Desde"
                type="time"
                value={horaDesde}
                onChange={(e) => setHoraDesde(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                required
                fullWidth
              />
              <MuiTextField
                label="Hora Hasta"
                type="time"
                value={horaHasta}
                onChange={(e) => setHoraHasta(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                required
                fullWidth
              />
            </Box>
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
