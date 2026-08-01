import './MedicoHome.css'
import '../../../components/banner/banner.css'
import { FaHeartbeat } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useUsuario } from '../../../context/UsuarioContext.jsx'

const turnosProximos = [
  { id: 1, paciente: 'María López', hora: '09:00', servicio: 'Cardiología', sede: 'Sede Centro' },
]

const MedicoHome = () => {
  const { usuario } = useUsuario()
  const nombreUsuario = usuario?.nombre || 'Profesional'
  const proximoTurno = turnosProximos[0]

  return (
    <main className="medico-home">
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">Atención médica de calidad</span>

            <h1>
              ¡Bienvenido nuevamente, Dr./Dra. <span>{nombreUsuario}</span>!
            </h1>

            <p>
              Te deseamos una excelente jornada. Desde aquí podés organizar tus consultas y brindar
              una mejor atención a tus pacientes.
            </p>

            <div className="hero-buttons">
              <Link to="/medico/agenda">
                <button className="btn-primary">Ver Agenda</button>
              </Link>
            </div>

            <div className="hero-proximo-turno-box">
              <span className="hero-proximo-label">Próximo turno</span>
              {proximoTurno && (
                <div className="hero-proximo-card">
                  <div>
                    <h4>{proximoTurno.paciente}</h4>
                    <p>{proximoTurno.servicio}</p>
                  </div>
                  <div className="hero-proximo-meta">
                    <span className="hora-badge-hero">{proximoTurno.hora}</span>
                    <small>{proximoTurno.sede}</small>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hero-image">
            <FaHeartbeat className="nav-pulse-icon-banner" />
          </div>
        </div>
      </section>

      <section className="medico-home__section">
        <div className="medico-home__section-header">
          <h2>Resumen de hoy</h2>
        </div>

        <div className="medico-home__info-grid">
          <div className="info-card-stat">
            <h3>8</h3>
            <span>Turnos de hoy</span>
          </div>

          <div className="info-card-stat">
            <h3>2</h3>
            <span>Cancelaciones</span>
          </div>

          <div className="info-card-stat">
            <h3>5</h3>
            <span>Notificaciones</span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default MedicoHome
