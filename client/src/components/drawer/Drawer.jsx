import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import EventNoteIcon from '@mui/icons-material/EventNote'
import HistoryIcon from '@mui/icons-material/History'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useNavigate } from 'react-router-dom'
import './Drawer.css'
import { useUsuario } from '../../context/UsuarioContext.jsx'

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false)
  const { usuario, cargandoUsuario } = useUsuario()

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen)
  }

  const navigate = useNavigate()

  const opciones = [
    { texto: 'Gestión de turnos', ruta: '/mis-turnos', icono: <EventNoteIcon /> },
    { texto: 'Historial de turnos', ruta: '/historial', icono: <HistoryIcon /> },
    { texto: 'Reservar turnos', ruta: '/reserva-de-turnos', icono: <EventAvailableIcon /> },
    { texto: 'Búsqueda de servicios', ruta: '/busqueda-de-servicios', icono: <SearchIcon /> },
  ]
  if (cargandoUsuario || !usuario) return null

  const DrawerList = (
    <Box className="drawer" role="presentation" onClick={toggleDrawer(false)}>
      <List className="drawer-list">
        {usuario.rol === 'paciente' &&
          opciones.map((opcion) => (
            <ListItem key={opcion.texto} disablePadding>
              <ListItemButton className="drawer-item" onClick={() => navigate(opcion.ruta)}>
                <ListItemIcon className="drawer-icon">{opcion.icono}</ListItemIcon>
                <ListItemText primary={opcion.texto} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  )

  return (
    <div>
      <IconButton onClick={toggleDrawer(true)}>
        <MenuRoundedIcon id="iconoDeMenu" sx={{ color: 'var(--color-primary)', fontSize: 35 }} />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  )
}
