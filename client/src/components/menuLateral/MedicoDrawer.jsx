import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useNavigate } from 'react-router-dom'
import './Drawer.css'

export default function MedicoDrawer() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen)
  }

  const opcionesMedico = [
    { text: 'Inicio', icon: <AccountCircleIcon />, path: '/medico/home' },
    { text: 'Agenda', icon: <CalendarMonthIcon />, path: '/medico/agenda' },
    { text: 'Servicios', icon: <MedicalServicesIcon /> },
    { text: 'Notificaciones', icon: <NotificationsIcon /> },
  ]

  const handleMenuClick = (path) => {
    if (path) {
      navigate(path)
    }
    setOpen(false)
  }

  const drawerList = (
    <Box className="drawer" role="presentation" onClick={toggleDrawer(false)}>
      <img
        src={'../../../images/logo-sweet-medical.png'}
        alt="Sweet Medical"
        className="drawer-logo"
      />
      <h4 className="drawer-title">Sweet Medical</h4>
      <List>
        {opcionesMedico.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleMenuClick(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <div className="menu-toggle-container">
      <div className="menu-toggle-header">
        <IconButton className="menu-toggle-button" onClick={toggleDrawer(true)}>
          <MenuIcon sx={{ fontSize: 35 }} />
        </IconButton>
        <h3 className="menu-toggle-brand">Sweet Medical</h3>
      </div>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </div>
  )
}
