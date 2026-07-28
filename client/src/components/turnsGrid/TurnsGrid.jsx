import { useEffect, useState } from "react";
import "./TurnsGrid.css";
import { getTurns } from "../../service/turnsService.js";
import TurnItem from "../turnItem/TurnItem";
import Paginacion from "../paginacion/Paginacion.jsx";
import {Spinner} from "react-bootstrap";

export default function TurnsGrid() {

    const [turnos, setTurnos] = useState([]);
    const [turnosFiltrados, setTurnosFiltrados] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    const filtrarTurnos = (filtros) => {
      if(filtros.trim() === " "){
        //muestro todos
        setTurnosFiltrados(turnos);
      }else{
        //muestro turnos filtrados
        // const filtered = turnos.filter( 
        // );
        // setTurnosFiltrados(filtros);
      }
    }

    const cargarTurnos = async (page = 1) => {
      const turnosCargados = await getTurns(page);
      setTurnos(turnosCargados.data.turnos);
      setTurnosFiltrados(turnosCargados.data.turnos);
      setPaginaActual(page);
      setTotalPaginas(turnosCargados.data.totalPages);

    }
    //para que cuando se monte el componente, cargue los turnos
    useEffect(() => {
      cargarTurnos()
    }, [])

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

            {turnosFiltrados.map((turno) => (

            <TurnItem key={turno._id} turno={turno}/>))}

            </tbody>
          </table>
        </div>
        <div className="paginacion">
            <Paginacion paginaActual={paginaActual} totalDePaginas={totalPaginas} cambioDePagina={(page) => cargarTurnos(page)}/>
        </div>
        
      </div>
    );
}