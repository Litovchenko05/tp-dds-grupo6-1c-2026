import { Navigate } from 'react-router-dom'
import { useUsuario } from '../../context/UsuarioContext.jsx'
import MedicoHome from '../medico/home/MedicoHome.jsx'
import ReservarTurnosPage from '../../features/reservarTurnosPage/reservarTurnosPage.jsx'
function HomeSwitcher() {
  const { usuario, cargandoUsuario } = useUsuario()

  console.log('HomeSwitcher', { usuario, cargandoUsuario })

  return (
    <div style={{ padding: 40 }}>
      <h1>HOME SWITCHER</h1>
      <pre>{JSON.stringify({ usuario, cargandoUsuario }, null, 2)}</pre>
    </div>
  )
}

export default HomeSwitcher
