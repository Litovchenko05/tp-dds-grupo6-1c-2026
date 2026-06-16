import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from "react-router-dom";

import './Drawer.css';

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const navigate = useNavigate();

  const opciones = [
    { texto: "Mis turnos", ruta: "/mis-turnos" },
    { texto: "Historial", ruta: "/historial" },
    { texto: "Reservar Turnos", ruta: "/reserva-de-turnos" },
    { texto: "Notificaciones", ruta: "/notificaciones" }
  ];

  const DrawerList = (
    <Box className="drawer" role="presentation" onClick={toggleDrawer(false)}>
        <img src={'../../../images/logo-sweet-medical.png'} alt="Sweet Medical" className="drawer-logo" />
            <h4 className="drawer-title">
            Sweet Medical
            </h4>
      <List>
        {opciones.map((opcion, index) => (
          <ListItem key={opcion.texto} disablePadding>
            <ListItemButton onClick={() => navigate(opcion.ruta)}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={opcion.texto} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <IconButton onClick={toggleDrawer(true)}> <MenuIcon sx={{ fontSize: 35 }} /></IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}