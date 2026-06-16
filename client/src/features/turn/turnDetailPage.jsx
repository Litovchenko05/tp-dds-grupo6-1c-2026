import { useParams } from "react-router-dom";
import { turnos } from "../../mockData/turnosMock.js";
import "./turnDetailPage.css";

const TurnDetailPage = () => {
  const { id } = useParams();
  const turno = turnos.find((t) => t.id === parseInt(id));

  if (!turno) {
    return (
      <div className="turn-detail-container">
        <div className="turn-header">
          <h1>Turno no encontrado para su reserva</h1>
          <p>Lo sentimos, no pudimos encontrar el turno que buscás.</p>
        </div>
      </div>
    );
  }

  return (

    <div className="turn-detail-container">
      <h1 class="turn-header ">¡Reserva tu turno ya!</h1>
      <div className="turn-header">
        <h1 class="turn-nombre">{turno.servicio}</h1>
        <div className="turn-categoria">Médico: {turno.medico}</div>
      </div>

      <div className="turn-content">
  
        <div className="turn-info-section">
          <div className="turn-description">
            Sede: {turno.sede}
          </div>
          <div className="turn-description">
            Fecha: {turno.fecha}
          </div>
         <div className="turn-description">
            Hora: {turno.fecha}
          </div>
           <div className="turn-description">
            Estado: {turno.estado}
          </div>

          <div className="input-obra-social">
            <label>Obra Social</label>
            <input type="text"></input>
          </div>

          <div className="input-plan">
            <label>Plan</label>
            <input type="text"></input>
          </div>

          <div className="turn-price-section">
            <div className="turn-precio">Costo: $ {turno.costo?.toLocaleString("es-AR")}</div>
          </div>
          
        </div>

      </div>

    
      <div className="points-section">
        Recuerda siempre revisar tus notificicaciones ante algún cambio
      </div>

      <div className="agregar-container">
        <button className="agregar">Agregar al carrito</button>
      </div>
    </div>
   
  );
};

export default TurnDetailPage;
