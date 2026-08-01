import { Navigate } from 'react-router-dom'
import { useUsuario } from '../../context/UsuarioContext.jsx'
import Home from './Home.jsx'
import MedicoHome from '../medico/home/MedicoHome.jsx'

function HomeSwitcher() {
  const { usuario, cargandoUsuario } = useUsuario()

  if (cargandoUsuario) return null
  if (usuario?.rol === 'medico') {
    return <MedicoHome />
  }

  if (usuario?.rol === 'paciente') {
    return <Home />
  }

  return <Navigate to="/login" replace />
}

export default HomeSwitcher
