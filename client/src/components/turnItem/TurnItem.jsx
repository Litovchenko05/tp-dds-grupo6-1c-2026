import { useState } from "react";

const TurnItem = ({ turno }) => {

    const [menuAbierto, setMenuAbierto] = useState(false);

    const abrirMenu = () => {

        setMenuAbierto(!menuAbierto);

    };

    const reservarTurno = () => {
        // navigate("/reservar-turno")
    };

    return (
      <tr>
        <td>{turno.servicio}</td>
        <td>{turno.medico}</td>
        <td>{turno.sede}</td>
        <td>{turno.fecha}</td>
        <td>{turno.hora}</td>
        <td>{turno.costo}</td>
        <td>
          <span className="tipo-badge">
            {turno.estado}
          </span>
        </td>
            <td className="acciones">
              <button
                className="menu-button"
                onClick={abrirMenu}>
                  ⋮
                </button>

                {menuAbierto && (
                    <div className="acciones-menu">
                        <button
                          onClick={reservarTurno}>
                        Reservar turno
                        </button>
                    </div>
                )}
        </td>
      </tr>
    );
};

export default TurnItem;