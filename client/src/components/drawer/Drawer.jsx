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
import { useNavigate } from 'react-router-dom'
import { useUsuario } from '../../context/UsuarioContext.jsx'
import './Drawer.css'

export default function TemporaryDrawer({ role = 'paciente', options, showLogout = true }) {
  const [open, setOpen] = React.useState(false)
  const { usuario, cargandoUsuario } = useUsuario()

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
    { texto: 'Inicio', ruta: '/medico/home', icono: <AccountCircleIcon /> },
    { texto: 'Agenda', ruta: '/medico/agenda', icono: <CalendarMonthIcon /> },
    { texto: 'Servicios', ruta: '/medico/home', icono: <MedicalServicesIcon /> },
    { texto: 'Notificaciones', ruta: '/notificaciones', icono: <NotificationsIcon /> },
  ]

  const DrawerList = (
    <Box className="drawer" role="presentation" onClick={toggleDrawer(false)}>
      <List className="drawer-list">
        {usuario.rol === 'paciente' &&
          opcionesPaciente.map((opcion) => (
            <ListItem key={opcion.texto} disablePadding>
              <ListItemButton className="drawer-item" onClick={() => navigate(opcion.ruta)}>
                <ListItemIcon className="drawer-icon">{opcion.icono}</ListItemIcon>
                <ListItemText primary={opcion.texto} />
              </ListItemButton>
            </ListItem>
          ))}

        {usuario.rol === 'medico' &&
          opcionesMedico.map((opcion) => (
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
