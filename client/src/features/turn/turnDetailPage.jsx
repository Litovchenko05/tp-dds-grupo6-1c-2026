import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Skeleton from '@mui/material/Skeleton'
import { turnos } from '../../mockData/turnosMock.js'
import { useCarrito } from '../../context/CarritoContext.jsx'
import AppSnackbar from '../../components/common/AppSnackbar.jsx'
import './turnDetailPage.css'

const conUnidades = (unidades, turno) => ({ ...turno, unidades })

const formatearFecha = (fechaISO) => {
  if (!fechaISO) return '-'
  const [year, month, day] = fechaISO.split('-')
  if (!year || !month || !day) return fechaISO
  return `${day}/${month}/${year}`
}

const TurnDetailPage = () => {
  const { carrito, actualizarCarrito } = useCarrito()
  const navigate = useNavigate()
  const { id } = useParams()
  const turno = turnos.find((t) => t.id === parseInt(id))

  const [unidades, setUnidades] = useState(0)
  const [obraSocial, setObraSocial] = useState('')
  const [plan, setPlan] = useState('')

  // Loading State
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Success Feedback
  // Error Feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  })

  useEffect(() => {
    setUnidades(0)
  }, [id, carrito])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(timer)
  }, [id])

  const abrirSnackbar = (severity, message) => {
    setSnackbar({ open: true, severity, message })
  }

  const cerrarSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  const agregarAlCarrito = () => {
    try {
      setIsSubmitting(true)
      actualizarCarrito(conUnidades(unidades, turno))
      // Success Feedback
      abrirSnackbar('success', 'Turno agregado al carrito correctamente.')
      setTimeout(() => navigate('/'), 450)
    } catch (error) {
      // Error Feedback
      abrirSnackbar('error', 'No se pudo agregar el turno al carrito.')
    } finally {
      setTimeout(() => setIsSubmitting(false), 450)
    }
  }

  const incrementarUnidades = () => {
    setUnidades(unidades + 1)
  }

  const decrementarUnidades = () => {
    if (unidades > 0) {
      setUnidades(unidades - 1)
    }
  }

  const calcularCosto = (obraSocialValue, planValue) => {
    let costoFinal = turno.costo

    if (obraSocialValue === 'OSDE' && planValue === 'BASICO') {
      costoFinal *= 0.8 * unidades
      return costoFinal
    }

    if (obraSocialValue === 'PAMI' && planValue === 'PREMIUM') {
      costoFinal *= 0.9 * unidades
      return costoFinal
    }

    return turno.costo * unidades
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

  if (isLoading) {
    return (
      <div className="turn-detail-container">
        <Skeleton variant="text" height={48} width="45%" />
        <Skeleton variant="text" height={40} width="35%" />
        <Skeleton variant="rounded" height={280} width="100%" />
      </div>
    )
  }

  const costo = calcularCosto(obraSocial, plan)

  return (
    <div className="turn-detail-container">
      <h1 className="turn-header">¡Reserva tu turno ya!</h1>
      <div className="turn-header">
        <h1 className="turn-nombre">{turno.servicio}</h1>
        <div className="turn-categoria">Médico: {turno.medico}</div>
      </div>

      <div className="turn-content">
        <div className="turn-info-section">
          <div className="turn-description">Sede: {turno.sede}</div>
          <div className="turn-description">Fecha: {formatearFecha(turno.fecha)}</div>
          <div className="turn-description">Hora: {turno.hora}</div>
          <div className={`turn-description estado-${String(turno.estado || '').toLowerCase()}`}>
            Estado: {turno.estado}
          </div>

          <div className="input-obra-social">
            <label>Obra Social</label>
            <input type="text" value={obraSocial} onChange={(e) => setObraSocial(e.target.value)} />
          </div>

          <div className="input-plan">
            <label>Plan</label>
            <input type="text" value={plan} onChange={(e) => setPlan(e.target.value)} />
          </div>

          <label>Cantidad de turnos</label>
          <div className="unidades">
            <button className="btn-carrito" onClick={incrementarUnidades} disabled={isSubmitting}>
              +
            </button>
            <button className="cantidad" disabled>
              {unidades}
            </button>
            <button
              className="btn-carrito"
              onClick={decrementarUnidades}
              disabled={unidades === 0 || isSubmitting}
            >
              -
            </button>
          </div>

          {costo !== null && (
            <div className="turn-price-section">
              <div className="turn-precio">Costo: $ {costo.toLocaleString('es-AR')}</div>
            </div>
          )}
        </div>
      </div>

      <div className="agregar-container">
        <button
          className="agregar"
          onClick={agregarAlCarrito}
          disabled={
            unidades === 0 || obraSocial.trim() === '' || plan.trim() === '' || isSubmitting
          }
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
              Procesando...
            </>
          ) : (
            'Agregar al carrito'
          )}
        </button>
      </div>

      <AppSnackbar
        open={snackbar.open}
        onClose={cerrarSnackbar}
        severity={snackbar.severity}
        message={snackbar.message}
      />
    </div>
  )
}

export default TurnDetailPage
