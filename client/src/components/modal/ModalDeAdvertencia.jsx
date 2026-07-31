import './Modal.css'

const ModalDeAdvertencia = ({ onCerrar }) => {
  return (
    <div className="modal-overlay-turnos">
      <div className="modal-turnos">
        <button className="modal-close" onClick={onCerrar}>
          ×
        </button>

        <h2 className="advertencia">Advertencia</h2>

        <p>
          Este turno ya se encuentra en tu carrito. No es posible agregar la misma reserva más de
          una vez.
        </p>
      </div>
    </div>
  )
}

export default ModalDeAdvertencia
