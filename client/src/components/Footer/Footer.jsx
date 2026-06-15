import './Footer.css';

const Footer = () => {
  return (
  <footer class="footer">
        <div class="footer-container">

            <div class="footer-section">
            <h3>Sweet Medical</h3>
            <p>
                Sistema integral de gestión médica para la administración de turnos,
                profesionales y pacientes.
            </p>
            </div>

            <div class="footer-section">
            <h3>Accesos Rápidos</h3>
            <ul>
                <li><a href="/">Inicio</a></li>
                <li><a href="/turnos">Turnos</a></li>
                <li><a href="/especialidades">Especialidades</a></li>
                <li><a href="/contacto">Contacto</a></li>
            </ul>
            </div>

            <div class="footer-section">
            <h3>Información</h3>
            <ul>
                <li>Atención al Paciente</li>
                <li>Profesionales Médicos</li>
                <li>Sedes de Atención</li>
                <li>Preguntas Frecuentes</li>
            </ul>
            </div>

            <div class="footer-section">
            <h3>Contacto</h3>
            <p>Email: contacto@sweetmedical.com</p>
            <p>Teléfono: +54 11 1234-5678</p>
            <p>Buenos Aires, Argentina</p>
            </div>

        </div>

        <div class="footer-bottom">
            <p>
            © 2026 Sweet Medical - Todos los derechos reservados.
            </p>
        </div>
  </footer>
  );
};

export default Footer;