import { Link } from 'react-router-dom'
import './MedicoFooter.css'

const MedicoFooter = () => {
  return (
    <footer className="medico-footer">
      <div className="medico-footer__container">
        <div className="medico-footer__section">
          <h3>Sweet Medical - Panel Médico</h3>
          <p>
            Espacio de gestión profesional para organizar agenda, revisar servicios y gestionar
            notificaciones médicas.
          </p>
        </div>

        <div className="medico-footer__section">
          <h3>Accesos rápidos</h3>
          <ul>
            <li>
              <Link to="/medico/home">Inicio</Link>
            </li>
            <li>
              <Link to="/medico/agenda">Agenda</Link>
            </li>
            <li>Servicios</li>
            <li>Notificaciones</li>
          </ul>
        </div>

        <div className="medico-footer__section">
          <h3>Información</h3>
          <ul>
            <li>Atención al Médico</li>
            <li>Preguntas frecuentes</li>
          </ul>
        </div>

        <div className="medico-footer__section">
          <h3>Contacto</h3>
          <p>Email: soporte.medico@sweetmedical.com</p>
          <p>Teléfono: +54 11 1234-5678</p>
          <p>Buenos Aires, Argentina</p>
        </div>
      </div>

      <div className="medico-footer__bottom">
        <p>© 2026 Sweet Medical - Módulo Médico. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default MedicoFooter
