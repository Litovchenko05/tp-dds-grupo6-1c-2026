import { useParams, useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import { useState, useEffect } from "react";
import { turnos } from "../../mockData/turnosMock.js";
import { useCarrito } from '../../context/CarritoContext.jsx';
import "./turnDetailPage.css";

const conUnidades = (unidades, turno) => ({...turno, unidades})

const TurnDetailPage = () => {

  const { carrito, actualizarCarrito } = useCarrito();
  const navigate = useNavigate();
  const { id } = useParams();
  const turno = turnos.find((t) => t.id === parseInt(id));

  
  const [obraSocial, setObraSocial] = useState("");
  const [plan, setPlan] = useState("");



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
      <h1 class="turn-header ">Reserva tu turno </h1>
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
            Hora: {turno.hora} hs
          </div>
           <div className="turn-description">
            Estado: {turno.estado}
          </div>

          <div className="input-obra-social">
            <label>Obra Social</label>
            <input
              type="text"
              value={obraSocial}
              onChange={(e) => setObraSocial(e.target.value)}
            />
          </div>

          <div className="input-plan">
            <label>Plan</label>
            <input
              type="text"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            />
          </div>

  
          
            <div className="turn-price-section">
                <div className="turn-precio">
                   Costo: $ {turno.costo.toLocaleString("es-AR")}
                </div>
            </div>
          
         
        </div>
      </div>

      <div className="agregar-container">
    
          <button className="agregar">
            Agregar al carrito
          </button>
      </div>

   </div>
   
  );
};

export default TurnDetailPage;
