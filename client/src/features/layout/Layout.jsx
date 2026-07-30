import { Outlet } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar'
import Footer from '../../components/footer/Footer'
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
