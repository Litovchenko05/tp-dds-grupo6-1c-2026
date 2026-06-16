import { useState } from "react";
import "./TurnsGrid.css";
import { turnos} from "../../mockData/turnosMock";
import  TurnItem from "../turnItem/TurnItem.jsx";
// import { productos } from "../../mockdata/Productos";
// import CarouselItem from "../productItem/CarouselItem";

export default function TurnsGrid() {
  
 return (
    <div class="contenedor-turnos">
         {turnos.map((turno) => (
              <TurnItem  turno={turno} key={turno.id} />
            ))}
    </div>
  );
}
