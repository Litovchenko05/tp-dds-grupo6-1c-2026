import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import LogoutIcon from '@mui/icons-material/Logout'
import IconButton from '@mui/material/IconButton'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { useNavigate } from 'react-router-dom'
import { useUsuario } from '../../context/UsuarioContext.jsx'

import './Drawer.css'

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false)
  const { cerrarSesion } = useUsuario()

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen)
  }

  const navigate = useNavigate()

  const opciones = [
    { texto: 'Mis turnos', ruta: '/mis-turnos' },
    { texto: 'Historial', ruta: '/historial' },
    { texto: 'Reservar Turnos', ruta: '/reserva-de-turnos' },
    { texto: 'Notificaciones', ruta: '/notificaciones' },
  ]

  const DrawerList = (
    <Box className="drawer" role="presentation" onClick={toggleDrawer(false)}>
      <div className="drawer-header">
        <img
          src={'../../../images/logo-sweet-medical.png'}
          alt="Sweet Medical"
          className="drawer-logo"
        />
        <h4 className="drawer-title">Sweet Medical</h4>
      </div>

      <List className="drawer-list">
        {opciones.map((opcion, index) => (
          <ListItem key={opcion.texto} disablePadding>
            <ListItemButton className="drawer-item" onClick={() => navigate(opcion.ruta)}>
              <ListItemIcon className="drawer-icon">
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={opcion.texto} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />

      <Divider className="drawer-divider" />
      <List className="drawer-footer">
        <ListItem disablePadding>
          <ListItemButton className="logout-btn" onClick={cerrarSesion}>
            <ListItemIcon>
              <LogoutIcon className="logout-icon" />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" className="logout-text" />
          </ListItemButton>
        </ListItem>
      </List>
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
