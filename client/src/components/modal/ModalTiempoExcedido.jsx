import './Modal.css'

const ModalTiempoExcedido = ({ onCerrar }) => {
  return (
    <div className="modal-overlay-turnos">
      <div className="modal-turnos">
        <button className="modal-close" onClick={onCerrar}>
          ×
        </button>

        <h2 className="advertencia">No es posible cancelar</h2>

        <p>
          {
            'Ya no estás en tiempo de cancelar este turno. La cancelación debe realizarse con al menos 1 hora de anticipación.'
          }
        </p>
      </div>
    </div>
  )
}

export default ModalTiempoExcedido
