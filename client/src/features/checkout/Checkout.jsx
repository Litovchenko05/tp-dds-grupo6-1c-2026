import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Checkout.css'
import { useCarrito } from '../../context/CarritoContext.jsx'
import { useUsuario } from '../../context/UsuarioContext.jsx'
import ModalTurnos from '../../components/modal/Modal.jsx'
import { FaTrash } from 'react-icons/fa'
import { crearReserva } from '../../service/turnsService.js'

const inicializarCampo = (requerido = true) => ({ valor: '', requerido })

const inicializarCampos = () => ({
  nombre: inicializarCampo(),
  apellido: inicializarCampo(),
  dni: inicializarCampo(),
  email: inicializarCampo(),
})

const Checkout = () => {
  const { carrito, limpiarCarrito, eliminarTurno } = useCarrito()
  const { usuario } = useUsuario()

  const [mostrarModal, setMostrarModal] = useState(false)

  const navigate = useNavigate()
  const [campos, setCampos] = useState(inicializarCampos())
  const valorDe = (nombreCampo) => campos[nombreCampo].valor

  const setValorDe = (nombreCampo) => (e) => {
    const nuevoValor = e.target.value
    setCampos({
      ...campos,
      [nombreCampo]: {
        ...campos[nombreCampo],
        valor: nuevoValor,
      },
    })
  }

  const camposCompletos = Object.values(campos).every(
    (campo) => !campo.requerido || campo.valor.length
  )

  const handleGuardar = async (e) => {
    e.preventDefault()
    try {
      for (const turno of carrito) {
        await crearReserva(usuario._id, turno.data._id)
      }
      setMostrarModal(true)
    } catch (error) {
      alert(`Error al guardar la reserva. Por favor, intente nuevamente `)
    }
  }

  const aceptarCompra = () => {
    setMostrarModal(false)
    limpiarCarrito()
    navigate('/')
  }

  const cerrarModal = () => {
    setMostrarModal(false)
  }

  const handleCancelar = () => {
    limpiarCarrito()
    navigate('/reservar-de-turnos')
  }

  return (
    <div className="conteiner">
      <div className="tittle-container">
        <h1> Confirma las reservas de tu carrito</h1>
        <p>
          Ingresa tus datos personales a continuación para enviar el comprobante de compra a tu
          mail.
        </p>
      </div>

      <div className="root">
        <div className="datos-personales">
          <h3>Datos personales</h3>
          <div className="form-container">
            <form onSubmit={handleGuardar} noValidate={false}>
              <div className="input-div">
                <label>Nombre</label>
                <input
                  type="text"
                  value={valorDe('nombre')}
                  onChange={setValorDe('nombre')}
                  required
                  minLength={2}
                  maxLength={50}
                  pattern="[A-Za-z]+"
                  title="El nombre solo puede contener letras, espacios y apóstrofos."
                ></input>
              </div>

              <div className="input-div">
                <label>Apellido</label>
                <input
                  type="text"
                  value={valorDe('apellido')}
                  onChange={setValorDe('apellido')}
                  required
                  minLength={2}
                  maxLength={50}
                  pattern="[A-Za-z]+"
                  title="El apellido solo puede contener letras, espacios y apóstrofos."
                ></input>
              </div>

              <div className="input-div">
                <label>DNI</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  pattern="\d{8}"
                  title="Ingrese un DNI válido de 8 dígitos como máximo."
                  value={valorDe('dni')}
                  onChange={setValorDe('dni')}
                  required
                ></input>
              </div>

              <div className="input-div">
                <label>Email</label>
                <input
                  type="email"
                  value={valorDe('email')}
                  onChange={setValorDe('email')}
                  required
                ></input>
              </div>

              <div className="actions">
                <button
                  type="submit"
                  disabled={!camposCompletos || carrito.length === 0}
                  className="btn"
                >
                  Guardar
                </button>

                <button className="btn" onClick={handleCancelar}>
                  Cancelar
                </button>

                {mostrarModal && (
                  <ModalTurnos turnos={carrito} onAceptar={aceptarCompra} onCerrar={cerrarModal} />
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="carrito-resumen">
          <h3>Resumen de compra</h3>

          {carrito.length === 0 ? (
            <p>El carrito está vacío</p>
          ) : (
            <>
              {carrito.map((turno) => {
                const fecha = new Date(turno.data.fechaHora)

                return (
                  <div key={turno.data._id} className="carrito-item">
                    <div className="carrito-item-header">
                      <h4>{turno.data.servicio.nombre}</h4>

                      <div className="carrito-item-actions">
                        <button
                          className="btn-eliminar"
                          onClick={() => eliminarTurno(turno.data._id)}
                          title="Eliminar reserva"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    <div className="carrito-item-body">
                      <p>
                        <strong>Médico:</strong> {turno.data.medico.nombre}
                      </p>

                      <p>
                        <strong>Sede:</strong> {turno.data.sede.nombre}
                      </p>

                      <p>
                        <strong>Fecha:</strong> {fecha.toLocaleDateString('es-AR')}
                      </p>

                      <p>
                        <strong>Hora:</strong>{' '}
                        {fecha.toLocaleTimeString('es-AR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      </p>
                    </div>
                    <div className="precio-checkout">
                      <span>${turno.data.costo}</span>
                    </div>
                  </div>
                )
              })}

              <div className="carrito-total">
                <span>Total</span>

                <span>${carrito.reduce((total, turno) => total + turno.data.costo, 0)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
export default Checkout
