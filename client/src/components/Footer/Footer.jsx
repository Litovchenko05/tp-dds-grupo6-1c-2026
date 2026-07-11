import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <span>© 2026 </span>
          <span className="footer-brand">Sweet Medical</span>
          <span> - Todos los derechos reservados.</span>
        </div>

        <ul className="footer-links">
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/mis-turnos">Mis Turnos</Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
