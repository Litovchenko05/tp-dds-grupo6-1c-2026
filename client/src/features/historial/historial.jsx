import  "./historial.css";


const HistorialTurnosPage = () => {
  
  return (
 <div class="contenedor-historial">

  <div className="contenedor-titulo">
     <h1>Historial de Turnos</h1>
   </div>

  <div class="tarjeta-turno completado">
    <div class="turno-encabezado">
      <span class="fecha"><time datetime="2026-05-15">15 Mayo, 2026</time></span>
      <span class="estado etiqueta-completado">Realizado</span>
    </div>
    <div class="turno-cuerpo">
      <h3>Consulta con Cardiología</h3>
      <p><strong>Médico:</strong> Dra. Violeta Martínez</p>
      <p><strong>Sede:</strong> Centro Médico Central</p>
      <p><strong>Hora:</strong> 10:00 hs</p>
      <p><strong>Costo:</strong> $30000 </p>
    </div>
  </div>

  <div class="tarjeta-turno cancelado">
    <div class="turno-encabezado">
      <span class="fecha"><time datetime="2026-04-22">22 Abril, 2026</time></span>
      <span class="estado etiqueta-cancelado">Cancelado</span>
    </div>
    <div class="turno-cuerpo">
      <h3>Consulta con Ginecología</h3>
      <p><strong>Médico:</strong> Dra. Estelea Rosas</p>
      <p><strong>Sede:</strong> Centro Médico Central</p>
      <p><strong>Hora:</strong> 11:00 hs</p>
      <p><strong>Costo:</strong> $40000 </p>
    </div>
  </div>
</div>

  );
};

export default HistorialTurnosPage;