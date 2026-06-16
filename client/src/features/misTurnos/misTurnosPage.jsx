import  "./misTurnosPage.css";

const MisTurnosPage = () => {
  
  return (

    <div class="contenedor-mis-turnos">

        <div className="contenedor-titulo">
            <h1>Mis turnos</h1>
        </div>

        <div class="tarjeta-turno-reservado">
            <div class="turno-encabezado">
                <span class="fecha"><time datetime="2026-05-15">25 Mayo, 2026</time></span>
            </div>
            <div class="turno-cuerpo">
                <h3>Consulta con Pediatría</h3>
                <p><strong>Médico:</strong> Dra. Violeta Martínez</p>
                <p><strong>Sede:</strong> Centro Médico Central</p>
                <p><strong>Hora:</strong> 10:00 hs</p>
                <p><strong>Estado:</strong> RESERVADO</p>
                <p><strong>Costo:</strong> $30000 </p>
            </div>
            <div className="contenedor-boton">
                <button className="btn-cancelar">Cancelar</button>
            </div>
        </div> 
        <div class="tarjeta-turno-reservado">
            <div class="turno-encabezado">
                <span class="fecha"><time datetime="2026-05-15">25 Mayo, 2026</time></span>
            </div>
            <div class="turno-cuerpo">
                <h3>Consulta con Oftalmología</h3>
                <p><strong>Médico:</strong> Dr. Javier Morales</p>
                <p><strong>Sede:</strong> Centro Médico del Sur</p>
                <p><strong>Hora:</strong> 08:00 hs</p>
                <p><strong>Estado:</strong> RESERVADO</p>
                <p><strong>Costo:</strong> $60000 </p>
            </div>
            <div className="contenedor-boton">
                <button className="btn-cancelar">Cancelar</button>
            </div>
        </div> 
    </div>

  );
};

export default MisTurnosPage;