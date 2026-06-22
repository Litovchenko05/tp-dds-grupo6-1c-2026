import "./TurnItem.css";
import { Link } from "react-router-dom";


const TurnItem = ({turno}) => {
  return (

    <div class="card-turno">
        <h2>Turno</h2>
        <div class="info-turno">

          <div class="item">
            <span class="label">Servicio:</span>
            <span>{turno.servicio}</span>
          </div>
          <div class="item">
            <span class="label">Médico:</span>
            <span>{turno.medico}</span>
          </div>
          <div class="item">
            <span class="label">Sede:</span>
            <span>{turno.sede}</span>
          </div>
          <div class="item">
            <span class="label">Fecha:</span>
            <span>{turno.fecha}</span>
          </div>
          <div class="item">
            <span class="label">Hora:</span>
            <span>{turno.hora}</span>
          </div>
         <div class="item">
            <span class="label">Costo:</span>
            <span>{turno.costo}</span>
          </div>
            <div class="item">
            <span class="label">Estado:</span>
            <span>{turno.estado}</span>
          </div>

        </div>
        <Link to={`/turnos/${turno.id}`} class="btn-reservar">
                Reservar
        </Link>
  
      </div>

  );
};
 
export default TurnItem;