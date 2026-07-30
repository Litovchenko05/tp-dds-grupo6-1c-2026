import './Home.css'
import { useUsuario } from '../../context/UsuarioContext.jsx'
import BannerPage from "../../components/banner/banner.jsx";
import BodyHome from "../../components/bodyHome/BodyHome.jsx";

const Home = () => {
  const { usuario } = useUsuario()
  return (
    <>
    <BannerPage/>
    <BodyHome/>
    </>
  )
}

export default Home
