import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const TurnItem = ({ turno }) => {
  const navigate = useNavigate()

  const [menuAbierto, setMenuAbierto] = useState(false)

  const abrirMenu = () => {
    setMenuAbierto(!menuAbierto)
  }

  const menuRef = useRef(null)

  useEffect(() => {
    function cerrarMenu(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false)
      }
    }

    document.addEventListener('mousedown', cerrarMenu)

    return () => {
      document.removeEventListener('mousedown', cerrarMenu)
    }
  }, [])

  const fecha = new Date(turno.fechaHora)
  const fechaDeFecha = fecha.toLocaleDateString('es-AR')
  const horaDeFecha = fecha.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const textoNivel = {
    TOTAL: 'TOTAL',
    PARCIAL: 'PARCIAL',
    NO_CUBIERTA: 'NO CUBIERTA',
  }

  const textoEstado = {
    disponible: 'Disponible',
  }

  const formatearCosto = (costo) => {
    if (costo === null || costo === 0 || costo === undefined) return 'Sin costo'
    return `$${costo.toLocaleString('es-AR')}`
  }

  return (
    <tr>
      <td>{turno.servicio.nombre}</td>
      <td>{turno.medico.nombre}</td>
      <td>{turno.sede.nombre}</td>
      <td>{fechaDeFecha}</td>
      <td>{horaDeFecha}</td>
      <td>{formatearCosto(turno.costoConCobertura)}</td>
      <td>{textoNivel[turno.nivelCobertura]}</td>
      <td className="acciones">
        <div ref={menuRef}>
          <button className="menu-button" onClick={abrirMenu}>
            ⋮
          </button>

          {menuAbierto && (
            <div className="acciones-menu">
              <button onClick={() => navigate(`/turnos/${turno._id}`)}>Reservar</button>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}

export default TurnItem
