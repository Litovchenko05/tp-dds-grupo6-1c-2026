import { Outlet } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import './Layout.css'

const Layout = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
