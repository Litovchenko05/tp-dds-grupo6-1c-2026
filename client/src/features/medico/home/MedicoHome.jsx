import './MedicoHome.css'
import '../../../components/banner/banner.css'
import { FaHeartbeat } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useUsuario } from '../../../context/UsuarioContext.jsx'
import useMedicoDashboardData from '../hooks/useMedicoDashboardData'

const formatearProximoTurno = (turno) => {
  if (!turno) return null
  const fechaHora = new Date(turno.fechaHora)
  return {
    paciente: turno.paciente?.usuario?.nombre || turno.paciente?.nombre || 'Sin paciente',
    hora: fechaHora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    servicio: turno.servicio?.nombre || 'Servicio no disponible',
    sede: turno.sede?.nombre || 'Sede no disponible',
  }
}

const MedicoHome = () => {
  const { usuario } = useUsuario()
  const nombreUsuario = usuario?.nombre || 'Profesional'
  const { data, loading, error } = useMedicoDashboardData(usuario?.medicoId)
  const proximoTurno = formatearProximoTurno(data?.proximosTurnos?.[0])

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
              {loading && <p>Cargando próximo turno...</p>}
              {error && <p>No se pudo cargar el próximo turno.</p>}
              {!loading && !error && !proximoTurno && <p>No hay próximos turnos programados.</p>}
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
            <h3>{loading ? '—' : (data?.turnosHoy ?? 0)}</h3>
            <span>Turnos de hoy</span>
          </div>

          <div className="info-card-stat">
            <h3>{loading ? '—' : (data?.cancelacionesHoy ?? 0)}</h3>
            <span>Cancelaciones</span>
          </div>

          <div className="info-card-stat">
            <h3>{loading ? '—' : (data?.notificacionesCount ?? 0)}</h3>
            <span>Notificaciones</span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default MedicoHome
