import "./banner.css";
import { FaHeartbeat } from "react-icons/fa";


const BannerPage = () => {
  
  return (
   <section className="hero-banner">

    <div className="hero-content">

        <div className="hero-text">

            <span className="hero-badge">
                 Atención médica de calidad
            </span>

            <h1>
                Bienvenido a <span>Sweet Medical</span>
            </h1>

            <p>
                Encontrá especialistas en el área, reservá turnos online, consultá tu historial
                médico y administrá toda tu atención de salud desde un único lugar,
                de forma rápida, segura y sencilla.
            </p>

            <div className="hero-buttons">

                <button className="btn-primary">
                    Reservar turno
                </button>

                <button className="btn-secondary">
                    Conocer servicios
                </button>

            </div>

            <div className="hero-info">

                <div className="info-card">
                    <h3>+120</h3>
                    <span>Médicos</span>
                </div>

                <div className="info-card">
                    <h3>+35</h3>
                    <span>Especialidades</span>
                </div>

                <div className="info-card">
                    <h3>+25</h3>
                    <span>Prácticas</span>
                </div>

            </div>

        </div>

        <div className="hero-image">
            <FaHeartbeat className="nav-pulse-icon" />
        </div>

    </div>

</section>
  );
};

export default BannerPage;