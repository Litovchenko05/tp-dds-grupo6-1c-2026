import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import NotificationsIcon from '@mui/icons-material/Notifications'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import EventNoteIcon from '@mui/icons-material/EventNote'
import HistoryIcon from '@mui/icons-material/History'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useNavigate } from 'react-router-dom'
import { useUsuario } from '../../context/UsuarioContext.jsx'
import './Drawer.css'
import { useUsuario } from '../../context/UsuarioContext.jsx'

export default function TemporaryDrawer({ role = 'paciente', options, showLogout = true }) {
  const [open, setOpen] = React.useState(false)
  const { usuario, cargandoUsuario, cerrarSesion } = useUsuario()

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen)
  }

  const navigate = useNavigate()

  const opcionesPaciente = [
    { texto: 'Gestión de turnos', ruta: '/mis-turnos', icono: <EventNoteIcon /> },
    { texto: 'Historial de turnos', ruta: '/historial', icono: <HistoryIcon /> },
    { texto: 'Reservar turnos', ruta: '/reserva-de-turnos', icono: <EventAvailableIcon /> },
    { texto: 'Búsqueda de servicios', ruta: '/busqueda-de-servicios', icono: <SearchIcon /> },
  ]
  if (cargandoUsuario || !usuario) return null

  const opcionesMedico = [
    { texto: 'Inicio', ruta: '/medico/home', icon: <AccountCircleIcon /> },
    { texto: 'Agenda', ruta: '/medico/agenda', icon: <CalendarMonthIcon /> },
    { texto: 'Servicios', ruta: '/medico/home', icon: <MedicalServicesIcon /> },
    { texto: 'Notificaciones', ruta: '/notificaciones', icon: <NotificationsIcon /> },
  ]

  const opcionesPorRol = role === 'medico' ? opcionesMedico : opcionesPaciente
  const opcionesFinales = options || opcionesPorRol

  const DrawerList = (
    <Box className="drawer" role="presentation" onClick={toggleDrawer(false)}>
      <List className="drawer-list">
        {opcionesFinales.map((opcion, index) => (
          <ListItem key={opcion.texto} disablePadding>
            <ListItemButton className="drawer-item" onClick={() => navigate(opcion.ruta)}>
              <ListItemIcon className="drawer-icon">
                {opcion.icon || (index % 2 === 0 ? <InboxIcon /> : <MailIcon />)}
              </ListItemIcon>
              <ListItemText primary={opcion.texto} />
            </ListItemButton>
          </ListItem>
        ))}
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

      {showLogout && (
        <>
          <Divider className="drawer-divider" />
          <List className="drawer-footer">
            <ListItem disablePadding>
              <ListItemButton
                className="logout-btn"
                onClick={() => {
                  setOpen(false)
                  cerrarSesion()
                }}
              >
                <ListItemIcon>
                  <LogoutIcon className="logout-icon" />
                </ListItemIcon>
                <ListItemText primary="Cerrar sesión" className="logout-text" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
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
