import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Navbar.css'
import '../../index.css'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined'
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined'
import TemporaryDrawer from '../menuLateral/Drawer.jsx'
import { useCarrito } from '../../context/CarritoContext.jsx'
import { useUsuario } from '../../context/UsuarioContext.jsx'
import { useNotificaciones } from '../../context/NotificacionesContext.jsx'

const Navbar = () => {
  const navigate = useNavigate()
  const { carrito } = useCarrito()
  const { usuario } = useUsuario()
  const { noLeidas } = useNotificaciones()
  const [cantUnidades, setCantUnidades] = useState(0)

  const irACheckout = () => {
    navigate('/checkout')
  }

  const cantUnidadesEnCarrito = () => {
    let suma = 0
    for (const turno of carrito) {
      suma += turno.unidades
    }
    return suma
  }

  useEffect(() => {
    setCantUnidades(cantUnidadesEnCarrito())
  }, [carrito])

  return (
    <header className="navbar-bg">
      <nav className="navbar">
        <div className="navbar-section left">
          <TemporaryDrawer />
        </div>

        <div className="navbar-section center">
          <div className="brand">
            <img
              src={'../../../images/logo-sweet-medical.png'}
              alt="Sweet Medical"
              className="nav-logo"
            />
            <Link to={`/`} className="link-no-style">
              <h1 className="brand-text">
                Sweet Medical <br /> Plataforma de Seguro de la Salud
              </h1>
            </Link>
          </div>
        </div>

        <div
          className="navbar-section right"
          style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
        >
          {usuario && (
            <span style={{ color: 'var(--color-ink)', fontWeight: '500' }}>
              Hola, {usuario.nombre}
            </span>
          )}

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
        </div>
      </nav>
    </header>
  )
}

export default Navbar
