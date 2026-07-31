import { useParams, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import { useState, useEffect } from 'react'
import { useCarrito } from '../../context/CarritoContext.jsx'
import './turnDetailPage.css'
import { getTurnById } from '../../service/turnsService.js'
import ModalDeAdvertencia from '../../components/modal/ModalDeAdvertencia.jsx'

const TurnDetailPage = () => {
  const { actualizarCarrito, verificarTurno } = useCarrito()
  const navigate = useNavigate()
  const { id } = useParams()
  const [mostrarModal, setMostrarModal] = useState(false)
  const [turno, setTurno] = useState(null)

  const cerrarModal = () => {
    setMostrarModal(false)
    navigate('/')
  }

  useEffect(() => {
    const cargarTurno = async () => {
      const data = await getTurnById(id)
      setTurno(data)
    }
    cargarTurno()
  }, [id])

  const reservar = (turno) => {
    const verificacion = verificarTurno(turno)
    if (verificacion) {
      setMostrarModal(true)
      return
    }
    actualizarCarrito(turno)
    navigate('/')
  }

  if (!turno) {
    return (
      <div className="turn-detail-container">
        <div className="turn-header">
          <h1>Turno no encontrado para su reserva</h1>
          <p>Lo sentimos, no pudimos encontrar el turno que buscás.</p>
        </div>
      </div>
    )
  }

  const fecha = new Date(turno.data.fechaHora)
  const fechaDeFecha = fecha.toLocaleDateString('es-AR')
  const horaDeFecha = fecha.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <div className="turn-detail-container">
      <h1 class="turn-header ">Reserva tu turno </h1>
      <div className="turn-header">
        <div className="turn-categoria">Servicio: {turno.data.servicio.nombre}</div>
        {/* <h1 class="turn-nombre">{turno.data.servicio.nombre}</h1> */}
        <div className="turn-categoria">Médico: {turno.data.medico.nombre}</div>
      </div>

      <div className="turn-content">
        <div className="turn-info-section">
          <div className="turn-description">Sede: {turno.data.sede.nombre}</div>
          <div className="turn-description">Fecha: {fechaDeFecha}</div>
          <div className="turn-description">Hora: {horaDeFecha} hs</div>
          <div className="turn-description">
            Estado: <span className="mayuscula"> {turno.data.estado}</span>
          </div>

          <div className="turn-price-section">
            <div className="turn-precio">Costo: $ {turno.data.costo}</div>
          </div>
        </div>
      </div>

      <div className="agregar-container">
        <button className="agregar" onClick={() => reservar(turno)}>
          Agregar al carrito
        </button>
      </div>

      {mostrarModal && <ModalDeAdvertencia onCerrar={cerrarModal} />}
    </div>
  )
}

export default TurnDetailPage
