import { useState } from "react";
import "./TurnsGrid.css";
import { turnos } from "../../mockData/turnosMock";
import TurnItem from "../turnItem/TurnItem";

export default function TurnsGrid() {

    const [paginaActual, setPaginaActual] = useState(1);

    const elementosPorPagina = 3;

    const indiceUltimo = paginaActual * elementosPorPagina;
    const indicePrimero = indiceUltimo - elementosPorPagina;

    const turnosPagina = turnos.slice(
        indicePrimero,
        indiceUltimo
    );

    const cantidadPaginas = Math.ceil(
        turnos.length / elementosPorPagina
    );

    return (
      <div className="turnos-container">
        <div className="tabla-container">
          <table className="servicios-table">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Médico</th>
                <th>Sede</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Costo</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

            {turnosPagina.map((turno) => (

            <TurnItem key={turno.id} turno={turno}/>))}

            </tbody>
      </table>
        </div>
          <div className="paginacion">
            <button
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual(paginaActual - 1)}
            >
              ‹
            </button>
            {
              Array.from(
                { length: cantidadPaginas },
                  (_, i) => i + 1
              )
              .map((num) => (
                  <button
                    key={num}
                    className={
                    paginaActual === num ? "pagina-activa": ""}
                    onClick={() => setPaginaActual(num)}>{num}
                  </button>
              ))}
                  <button
                    disabled={paginaActual === cantidadPaginas}
                    onClick={() => setPaginaActual(paginaActual + 1)}
                  >
                    ›
                  </button>
            </div>
      </div>
    );
}