import React, { useState } from 'react'
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Menu,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import EventIcon from '@mui/icons-material/Event'
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

  const [anchorEl, setAnchorEl] = useState(null)
  const [servicioSeleccionadoId, setServicioSeleccionadoId] = useState(null)

  const handleOpenMenu = (event, id) => {
    setAnchorEl(event.currentTarget)
    setServicioSeleccionadoId(id)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setServicioSeleccionadoId(null)
  }

  const handleEliminarItem = () => {
    if (servicioSeleccionadoId) {
      handleDeleteServicio(servicioSeleccionadoId)
    }
    handleCloseMenu()
  }

  const handleModificarServicio = () => {
    if (servicioSeleccionadoId) {
      const servicio = servicios.find((s) => s._id === servicioSeleccionadoId)
      console.log('Modificar servicio:', servicio)
    }
    handleCloseMenu()
  }

  const handleModificarDisponibilidad = () => {
    if (servicioSeleccionadoId) {
      const servicio = servicios.find((s) => s._id === servicioSeleccionadoId)
      console.log('Modificar disponibilidad:', servicio)
    }
    handleCloseMenu()
  }

  return (
    <Paper className="profile-card-base" elevation={1}>
      <Typography variant="h5" className="profile-section-title">
        Mis Servicios y Horarios
      </Typography>
      <Typography variant="body2" className="profile-section-subtitle">
        Gestioná las prestaciones médicas que ofrecés y configurá sus agendas de atención.
      </Typography>

      <Box className="profile-btn-container mb-xl">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="profile-btn-primary"
          onClick={handleAbrirPopup}
        >
          Ofrecer Nuevo Servicio
        </Button>
      </Box>

      {servicios.length === 0 ? (
        <Typography variant="body2" className="profile-empty-text" align="center">
          No tenés servicios registrados actualmente.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined" className="profile-table-container">
          <Table className="profile-table" aria-label="tabla de servicios del medico">
            <TableHead className="profile-table-head">
              <TableRow>
                <TableCell>
                  <strong>Servicio / Tipo</strong>
                </TableCell>
                <TableCell>
                  <strong>Sede</strong>
                </TableCell>
                <TableCell>
                  <strong>Día y Horario</strong>
                </TableCell>
                <TableCell>
                  <strong>Duración</strong>
                </TableCell>
                <TableCell>
                  <strong>Costo</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Acciones</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicios.map((servicio) => (
                <TableRow key={servicio._id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" className="profile-text-bold">
                      {servicio.nombre || servicio.servicio?.nombre}
                    </Typography>
                    {servicio.tipo && (
                      <Chip
                        label={servicio.tipo}
                        size="small"
                        color={servicio.tipo.toLowerCase() === 'practica' ? 'secondary' : 'primary'}
                        variant="outlined"
                        className="profile-chip"
                      />
                    )}
                  </TableCell>

                  <TableCell>
                    {servicio.sede || servicio.sedeObjeto?.nombre || 'Sede no especificada'}
                  </TableCell>

                  <TableCell>
                    {servicio.diaSemana ? (
                      <Box>
                        <Typography variant="body2" className="profile-text-medium">
                          {servicio.diaSemana}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {servicio.horaDesde} hs - {servicio.horaHasta} hs
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Sin horario asignado
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>{servicio.duracion}</TableCell>

                  <TableCell>
                    <strong>
                      ${Number(servicio.precio || servicio.costo || 0).toLocaleString('es-AR')}
                    </strong>
                  </TableCell>

                  <TableCell align="right">
                    <IconButton onClick={(e) => handleOpenMenu(e, servicio._id)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleModificarServicio}>
          <EditIcon fontSize="small" className="menu-icon-secondary" />
          Modificar Servicio
        </MenuItem>

        <MenuItem onClick={handleModificarDisponibilidad}>
          <EventIcon fontSize="small" className="menu-icon-secondary" />
          Modificar Disponibilidad
        </MenuItem>

        <Divider className="menu-divider" />

        <MenuItem onClick={handleEliminarItem} className="menu-item-error">
          <DeleteIcon fontSize="small" className="menu-icon-error" />
          Eliminar
        </MenuItem>
      </Menu>

      <Dialog open={openPopup} onClose={handleCerrarPopup} fullWidth maxWidth="xs">
        <DialogTitle>Agregar Servicio y Disponibilidad</DialogTitle>
        <Box component="form" onSubmit={handleAddServicioYDisponibilidad}>
          <DialogContent className="popup-form-container">
            <FormControl fullWidth required margin="dense">
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

            <FormControl fullWidth required disabled={!tipoSeleccionado} margin="dense">
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

            <FormControl fullWidth required margin="dense">
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
              margin="dense"
            />

            <FormControl fullWidth required margin="dense">
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

            <Divider className="popup-divider" />

            <Typography variant="subtitle2" color="primary" className="popup-section-subtitle">
              Horario de Atención
            </Typography>

            <FormControl fullWidth required margin="dense">
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

            <Box className="popup-time-container">
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
