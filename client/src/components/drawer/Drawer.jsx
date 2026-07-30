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
import IconButton from '@mui/material/IconButton'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { useNavigate } from 'react-router-dom'
import './Drawer.css'

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen)
  }

  const navigate = useNavigate()

  const opciones = [
    { texto: 'Gestión de turnos', ruta: '/mis-turnos' },
    { texto: 'Historial de turnos', ruta: '/historial' },
    { texto: 'Reservar turnos', ruta: '/reserva-de-turnos' },
    { texto: 'Búsqueda de servicios', ruta: '/busqueda-de-servicios' },
    { texto: 'Notificaciones', ruta: '/notificaciones' },
  ]

  const DrawerList = (
    <Box className="drawer" role="presentation" onClick={toggleDrawer(false)}>
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
