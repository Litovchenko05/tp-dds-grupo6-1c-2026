import "./Footer.css";
import {
    FaHeartbeat,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn
} from "react-icons/fa";

export default function Footer() {

    return (

        <footer className="footer">

            <div className="footer-container">

                <div className="footer-col">

                    <h2>
                        <FaHeartbeat className="footer-logo"/>
                        Sweet Medical
                    </h2>

                    <p>
                        Brindamos atención médica de calidad,
                        facilitando la gestión de turnos y el acceso
                        a profesionales de la salud de forma rápida
                        y segura.
                    </p>

                </div>


                <div className="footer-col">

                    <h3>Servicios</h3>

                    <ul>

                        <li>Especialidades</li>

                        <li>Prácticas</li>

                        <li>Reserva de turnos</li>

                        <li>Centros médicos</li>

                    </ul>

                </div>


                <div className="footer-col">

                    <h3>Contacto</h3>

                    <ul>

                        <li>
                            <FaMapMarkerAlt/>
                            Av. Siempre Viva 123
                        </li>

                        <li>
                            <FaPhoneAlt/>
                            (011) 4321-1234
                        </li>

                        <li>
                            <FaEnvelope/>
                            contacto@sweetmedical.com
                        </li>

                    </ul>

                </div>


                <div className="footer-col">

                    <h3>Seguinos</h3>

                    <div className="footer-social">

                        <FaFacebookF/>

                        <FaInstagram/>

                        <FaLinkedinIn/>

                    </div>

                </div>

            </div>


            <div className="footer-bottom">

                © 2026 Sweet Medical · Todos los derechos reservados.

            </div>

        </footer>

    );

}