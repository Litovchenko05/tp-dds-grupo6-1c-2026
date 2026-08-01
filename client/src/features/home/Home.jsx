import './Home.css'
import { useUsuario } from '../../context/UsuarioContext.jsx'
import BannerPage from '../../components/banner/banner.jsx'
import BodyHome from '../../components/bodyHome/BodyHome.jsx'

const Home = () => {
  const { usuario, cargandoUsuario } = useUsuario()
  if (cargandoUsuario || !usuario) return null
  return (
    <>
      {usuario.rol === 'paciente' && <BannerPage />}
      {usuario.rol === 'paciente' && <BodyHome />}
    </>
  )
}

export default Home
