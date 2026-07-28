import "./Modal.css";

const ModalTurnos = ({ turnos, onAceptar, onCerrar }) => {

    return (
        <div className="modal-overlay-turnos">

            <div className="modal-turnos">

                <button 
                    className="modal-close"
                    onClick={onCerrar}
                >
                    ×
                </button>

                <h2>
                    Reserva confirmada
                </h2>

                <p>
                    Estos son tus turnos:
                </p>


                <div className="turnos-grid">

                    <div className="grid-header">
                        <span>Servicio</span>
                        <span>Médico</span>
                        <span>Sede</span>
                        <span>Fecha</span>
                        <span>Hora</span>
                        <span>Costo</span>
                    </div>


                    {turnos.map((turno) => {

                        const fecha = new Date(turno.data.fechaHora);

                        return (
                            <div 
                              className="grid-row"
                              key={turno.data._id}
                            >
                                <span>{turno.data.servicio.nombre}</span>
                                <span>{turno.data.medico.nombre}</span>
                                <span>{turno.data.sede.nombre}</span>
                                <span>
                                  {fecha.toLocaleDateString("es-AR")}
                                </span>
                                <span>
                                  {fecha.toLocaleTimeString(
                                    "es-AR",
                                    {
                                      hour:"2-digit",
                                      minute:"2-digit",
                                      hour12: false
                                    }
                                  )}
                                </span>
                                <span>
                                  ${turno.data.costo}
                                </span>
                            </div>
                        )
                    })}

                </div>

                <div className="conteiner-button">
                <button
                    className="modal-button"
                    onClick={onAceptar}
                >
                    Aceptar
                </button>
                </div>

            </div>

        </div>
    )
}

export default ModalTurnos;