import { useState } from 'react'
import './Modal.css'

const ModalCancelarTurno = ({ onCerrar, onAceptar }) => {
  const [motivo, setMotivo] = useState('')

  const handleAceptar = () => {
    console.log('se hizo click en aceptar')
    if (!motivo.trim()) {
      alert('Debés indicar el motivo de la cancelación.')
      return
    }

    onAceptar(motivo)
  }

  return (
    <div className="modal-overlay-turnos">
      <div className="modal-turnos">
        <button className="modal-close" onClick={onCerrar}>
          ×
        </button>

        <h2 className="advertencia">Cancelar turno</h2>

        <p>Indicá el motivo por el cual deseás cancelar este turno.</p>

        <textarea
          className="motivo-cancelacion"
          placeholder="Escribí el motivo..."
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />

        <div className="modal-botones">
          <button className="modal-button" onClick={handleAceptar}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalCancelarTurno
