import './MedicoHome.css'

const turnosProximos = [
  { id: 1, paciente: 'María López', hora: '09:00', servicio: 'Cardiología', sede: 'Sede Centro' },
  { id: 2, paciente: 'Juan Pérez', hora: '10:30', servicio: 'Clínica Médica', sede: 'Sede Norte' },
  { id: 3, paciente: 'Ana Gómez', hora: '12:00', servicio: 'Dermatología', sede: 'Sede Centro' },
]

const medicoMock = {
  apellido: 'Pérez',
  genero: 'M',
}

const obtenerSaludoMedico = ({ apellido, genero }) => {
  const apellidoSeguro = apellido?.trim() || 'Profesional'

  const generoNormalizado = (genero || '').toString().trim().toUpperCase()

  if (generoNormalizado === 'F' || generoNormalizado === 'FEMENINO') {
    return `Bienvenida Dra. ${apellidoSeguro}`
  }

  if (generoNormalizado === 'M' || generoNormalizado === 'MASCULINO') {
    return `Bienvenido Dr. ${apellidoSeguro}`
  }

  return `Bienvenido/a Dr./Dra. ${apellidoSeguro}`
}

const MedicoHome = () => {
  const saludoMedico = obtenerSaludoMedico(medicoMock)

  return (
    <main className="medico-home">
      <section className="medico-home__hero">
        <h1>{saludoMedico}</h1>
        <p>Gestioná tus turnos, servicios y notificaciones desde un solo lugar.</p>
      </section>

      <section className="medico-home__stats">
        <article className="medico-home__card">
          <h3>Turnos de hoy</h3>
          <p className="medico-home__card-value">8</p>
        </article>
        <article className="medico-home__card">
          <h3>Próximo turno</h3>
          <p className="medico-home__card-value">09:00</p>
        </article>
        <article className="medico-home__card">
          <h3>Cancelaciones</h3>
          <p className="medico-home__card-value">2</p>
        </article>
        <article className="medico-home__card">
          <h3>No leídas</h3>
          <p className="medico-home__card-value">5</p>
        </article>
      </section>

      <section className="medico-home__section">
        <div className="medico-home__section-header">
          <h2>Próximos turnos</h2>
          <span>Agenda de hoy</span>
        </div>

        <div className="medico-home__turns">
          {turnosProximos.map((turno) => (
            <article className="medico-home__turn-item" key={turno.id}>
              <div>
                <h4>{turno.paciente}</h4>
                <p>{turno.servicio}</p>
              </div>
              <div className="medico-home__turn-meta">
                <span>{turno.hora}</span>
                <small>{turno.sede}</small>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default MedicoHome
