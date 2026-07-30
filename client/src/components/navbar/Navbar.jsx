import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Navbar.css'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined'
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined'
import ExitToAppIcon from '@mui/icons-material/ExitToAppOutlined'
import AccountBoxIcon from '@mui/icons-material/AccountBoxOutlined'
import { HeartPulse } from 'lucide-react'
import TemporaryDrawer from '../drawer/Drawer.jsx'
import { useCarrito } from '../../context/CarritoContext.jsx'
import { useUsuario } from '../../context/UsuarioContext.jsx'
import { useNotificaciones } from '../../context/NotificacionesContext.jsx'

const Navbar = () => {
  const navigate = useNavigate()
  const { carrito } = useCarrito()
  const { usuario, cerrarSesion } = useUsuario()
  const { noLeidas } = useNotificaciones()
  const [cantUnidades, setCantUnidades] = useState(0)

  const [anchorEl, setAnchorEl] = useState(null)
  const menuAbierto = Boolean(anchorEl)

  const handleAbrirMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCerrarMenu = () => {
    setAnchorEl(null)
  }

  const handleIrAPerfil = () => {
    handleCerrarMenu()
    navigate('/perfil')
  }

  const handleCerrarSesionClick = () => {
    handleCerrarMenu()
    cerrarSesion()
  }

  const irACheckout = () => {
    navigate('/checkout')
  }

  useEffect(() => {
    
    const cantUnidadesEnCarrito = () => {
    let suma = 0
      for (const turno of carrito) {
        suma += 1
      }
      return suma;
    }
    setCantUnidades(cantUnidadesEnCarrito())
  }, [carrito])

  const inicialUsuario = usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'

  return (
    <header className="navbar-bg">
      <nav className="navbar">
        <div className="navbar-section left">
          <TemporaryDrawer />
        </div>

        <div className="navbar-section center">
          <Link to="/home" className="link-no-style brand">
            <HeartPulse className="nav-pulse-icon" />
            <h1 className="brand-text">Sweet Medical</h1>
          </Link>
        </div>

        <div className="navbar-section right">
          <IconButton aria-label="ver notificaciones" onClick={() => navigate('/notificaciones')}>
            <Badge badgeContent={noLeidas} color="error">
              <NotificationsIcon style={{ color: 'var(--color-primary)' }} />
            </Badge>
          </IconButton>

          <IconButton aria-label="view cart with items" onClick={irACheckout}>
            <Badge badgeContent={cantUnidades} color="error">
              <ShoppingCartIcon id="iconoDeCart" style={{ color: 'var(--color-primary)' }} />
            </Badge>
          </IconButton>

          <IconButton
            aria-label="abrir menú de usuario"
            onClick={handleAbrirMenu}
            aria-controls={menuAbierto ? 'menu-usuario' : undefined}
            aria-haspopup="true"
            aria-expanded={menuAbierto ? 'true' : undefined}
            className="navbar-profile-button"
          >
            <Avatar className="navbar-avatar">{inicialUsuario}</Avatar>
          </IconButton>

          <Menu
            id="menu-usuario"
            anchorEl={anchorEl}
            open={menuAbierto}
            onClose={handleCerrarMenu}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleIrAPerfil} className="navbar-menu-item">
              <AccountBoxIcon fontSize="small" className="navbar-menu-icon" />
              Mi Perfil
            </MenuItem>

            <MenuItem
              onClick={handleCerrarSesionClick}
              className="navbar-menu-item navbar-menu-item--logout"
            >
              <ExitToAppIcon fontSize="small" className="navbar-menu-icon" />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
