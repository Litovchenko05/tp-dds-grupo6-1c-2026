import './BodyHome.css'
import { Link } from "react-router-dom";

const BodyHome = () => {

  return (
    <>
        <section>
            <div class="wrap">
           
            <h2>De la búsqueda al turno confirmado</h2>
            <p class="lede">Cuatro pasos, sin llamados ni esperas: elegís el servicio que querés, vemos qué cubre tu obra social y listo.</p>
                <div class="steps">
                    <div class="step">
                    <div class="step-num">1</div>
                    <h3>Buscá un turno</h3>
                    <p>Filtrá por profesional, especialidad, práctica, sede, fechas y reserva tu turno.</p>
                    </div>
                    <div class="step">
                    <div class="step-num">2</div>
                    <h3>Elegí el mejor precio</h3>
                    <p>Vemos automáticamente qué cubre tu plan: total, parcial o particular.</p>
                    </div>
                    <div class="step">
                    <div class="step-num">3</div>
                    <h3>Reservá tu turno</h3>
                    <p>Elegí día y horario disponible en segundos, sin esperar en línea.</p>
                    </div>
                    <div class="step">
                    <div class="step-num">4</div>
                    <h3>Recibí un recordatorio</h3>
                    <p>Te recordamos tu turno un día antes de tu consulta.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="benefits-section">
            <div class="wrap">
            <h2>Pensado para que la salud no sea un trámite</h2>
            <p class="lede">Todo lo que necesitás para gestionar tu atención médica, en un solo lugar.</p>
            <div class="benefits-grid">
                <div class="benefit-card highlight">
                <div class="benefit-icon">💳</div>
                <h3>Cobertura al instante</h3>
                <p>Sabé cuánto vas a pagar antes de confirmar, según tu obra social y plan.</p>
                </div>
                <div class="benefit-card highlight">
                <div class="benefit-icon">🗓️</div>
                <h3>Turnos 100% online</h3>
                <p>Reservá en menos de 2 minutos, desde donde estés.</p>
                </div>
                <div class="benefit-card highlight" >
                <div class="benefit-icon">🔔</div>
                <h3>Recordatorios automáticos</h3>
                <p>Te avisamos ante cada cambio: confirmaciones, cancelaciones y turnos próximos.</p>
                </div>
                <div class="benefit-card highlight" >
                <div class="benefit-icon">📋</div>
                <h3>Todo centralizado</h3>
                <p>Historial, turnos y servicios en un mismo lugar, siempre a mano.</p>
                </div>
            </div>
            </div>
        </section>

      
        <section class="stats-section">
            <div class="wrap">
            <div class="stats-head">
                <h2>Estadísticas que respaldan la experiencia</h2>
                <p>Así usan Sweet Medical pacientes y profesionales cada mes.</p>
            </div>
            <div class="stats-grid">
                <div>
                <div class="stat-num">+50K</div>
                <div class="stat-label">Turnos gestionados por mes</div>
                </div>
                <div>
                <div class="stat-num">90s</div>
                <div class="stat-label">Tiempo promedio de reserva</div>
                </div>
                <div>
                <div class="stat-num">98%</div>
                <div class="stat-label">Turnos confirmados sin inconvenientes</div>
                </div>
            </div>
            </div>
        </section>

    
        <section class="last-section">
            <div class="cta-section">
            <h2>Tu salud no puede esperar</h2>
            <p>Reservá tu turno hoy y dejá que nosotros nos ocupemos del resto.</p>
                <Link to={"/reserva-de-turnos"} >
                    <button class="btn-last-section">
                        Reservar turno
                    </button>
                </Link>
            </div>
        </section>


    </>
  )
}

export default BodyHome
