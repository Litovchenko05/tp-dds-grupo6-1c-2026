import { useState } from "react";
import "./TurnsGrid.css";

// import { productos } from "../../mockdata/Productos";
// import CarouselItem from "../productItem/CarouselItem";

export default function TurnsGrid() {
  
 return (
    <div class="contenedor-turnos">
        <div class="card-turno">
        <h2>Turno</h2>
        <div class="info-turno">
          <div class="item">
            <span class="label">Especialidad:</span>
            <span>Cardiología</span>
          </div>

          <div class="item">
            <span class="label">Práctica:</span>
            <span>Electrocardiograma</span>
          </div>

          <div class="item">
            <span class="label">Fecha:</span>
            <span>15/06/2026</span>
          </div>

          <div class="item">
            <span class="label">Hora:</span>
            <span>10:30</span>
          </div>

          <div class="item">
            <span class="label">Médico:</span>
            <span>Dr. Juan Pérez</span>
          </div>
        </div>

        <button class="btn-reservar">
          Reservar
        </button>
      </div>
    </div>
  );
}
