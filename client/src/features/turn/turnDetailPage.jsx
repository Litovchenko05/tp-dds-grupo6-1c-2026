import { useParams, useNavigate} from "react-router-dom";
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

  const [unidades, setUnidades] = useState(0);
  const [obraSocial, setObraSocial] = useState("");
  const [plan, setPlan] = useState("");

  useEffect(() => { setUnidades(0); 
  }, [id, carrito])

  const agregarAlCarrito = () => {
    actualizarCarrito(conUnidades(unidades, turno));
    navigate('/');
  };

  const incrementarUnidades = () => {
    setUnidades(unidades + 1);
  };

  const decrementarUnidades = () => {
    if (unidades > 0) {
      setUnidades(unidades - 1);
    }
  };

  const calcularCosto = (obraSocial, plan) => {
      let costoFinal = turno.costo;

      if (obraSocial === "OSDE" && plan === "BASICO") {
        costoFinal *= 0.8*unidades;
      }

      if (obraSocial === "PAMI" && plan === "PREMIUM") {
        costoFinal *= 0.9*unidades;
      }

      return costoFinal;
  };

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

          <label>Cantidad de turnos</label>
          <div className="unidades">
              <button className="btn-carrito" onClick={incrementarUnidades}>+</button>
              <button  className="cantidad"   disabled>{unidades}</button>
              <button className="btn-carrito" onClick={decrementarUnidades} disabled={unidades === 0}>-</button>   
          </div>

          {obraSocial.trim() !== "" && plan.trim() !== "" && (
            <div className="turn-price-section">
              <div className="turn-precio">
                Costo: ${" "}
                {calcularCosto(obraSocial,plan).toLocaleString("es-AR")}
              </div>
            </div>
          )}
         
        </div>
      </div>

      <div className="agregar-container">
              <button
                className="agregar"
                onClick={agregarAlCarrito}
                disabled={
                  unidades === 0 ||
                  obraSocial.trim() === "" ||
                  plan.trim() === ""
                }
              >
                Agregar al carrito
              </button>
      </div>

   </div>
   
  );
};

export default TurnDetailPage;
