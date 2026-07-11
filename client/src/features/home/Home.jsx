import './Home.css'
import { useUsuario } from '../../context/UsuarioContext.jsx'

const Home = () => {
  const { usuario } = useUsuario()
  return (
    <>
      <div className="home-body"></div>
      {usuario && <span className="navbar-username">Hola, {usuario.nombre}</span>}
    </>
  )
}

export default Home
