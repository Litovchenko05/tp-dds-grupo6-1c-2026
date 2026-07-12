import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const TurnItem = ({ turno }) => {

    const [menuAbierto, setMenuAbierto] = useState(false);

    const abrirMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    const menuRef = useRef(null);

    useEffect(() => {

    function cerrarMenu(event) {
      if (
            menuRef.current &&
            !menuRef.current.contains(event.target)
        ) {
            setMenuAbierto(false);
        }

    }

    document.addEventListener("mousedown", cerrarMenu);

    return () => {
        document.removeEventListener("mousedown", cerrarMenu);
    };

      }, []);

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
              <div ref={menuRef}>
              <button
                className="menu-button"
                onClick={abrirMenu}>
                  ⋮
                </button>

                {menuAbierto && (
                  <div className="acciones-menu">
                    <Link to={`/turnos/${turno.id}`} class="btn-reservar">
                      <button>
                        Reservar
                      </button>
                    </Link>    
                  </div>
                )}
              </div>
          </td>
      </tr>
    );
};

export default TurnItem;