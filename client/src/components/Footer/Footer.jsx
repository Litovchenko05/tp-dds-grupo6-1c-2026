import { Link } from 'react-router-dom'
import { useUsuario } from '../../context/UsuarioContext.jsx'
import './Footer.css'

const Footer = () => {
  const { usuario } = useUsuario()
  const esMedico = usuario?.rol === 'medico'

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>{esMedico ? 'Sweet Medical - Panel Médico' : 'Sweet Medical'}</h3>
          <p>
            {esMedico
              ? 'Espacio de gestión profesional para organizar agenda, revisar servicios y gestionar notificaciones médicas.'
              : 'Sistema integral de gestión médica para la administración de turnos, profesionales y pacientes.'}
          </p>
        </div>

        <div className="footer-section">
          <h3>Accesos Rápidos</h3>
          {esMedico ? (
            <ul>
              <li>
                <Link to="/medico/home">Inicio</Link>
              </li>
              <li>
                <Link to="/medico/agenda">Agenda</Link>
              </li>
              <li>Servicios</li>
              <li>
                <Link to="/notificaciones">Notificaciones</Link>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/mis-turnos">Turnos</Link>
              </li>
              <li>
                <Link to="/reserva-de-turnos">Reservar turnos</Link>
              </li>
              <li>
                <Link to="/notificaciones">Notificaciones</Link>
              </li>
            </ul>
          )}
        </div>

        <div className="footer-section">
          <h3>Información</h3>
          {esMedico ? (
            <ul>
              <li>Atención al Médico</li>
              <li>Preguntas frecuentes</li>
            </ul>
          ) : (
            <ul>
              <li>Atención al Paciente</li>
              <li>Profesionales Médicos</li>
              <li>Sedes de Atención</li>
              <li>Preguntas Frecuentes</li>
            </ul>
          )}
        </div>

        <div className="footer-section">
          <h3>Contacto</h3>
          <p>
            {esMedico
              ? 'Email: soporte.medico@sweetmedical.com'
              : 'Email: contacto@sweetmedical.com'}
          </p>
          <p>Teléfono: +54 11 1234-5678</p>
          <p>Buenos Aires, Argentina</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          {esMedico
            ? '© 2026 Sweet Medical - Módulo Médico. Todos los derechos reservados.'
            : '© 2026 Sweet Medical - Todos los derechos reservados.'}
        </p>
      </div>
    </footer>
  )
}

export default Footer
