import { useEffect, useState } from 'react'

import { Box, Typography, Paper, Button } from '@mui/material'
import { getMisTurns, cancelarTurno } from '../../service/turnsService'
import { useUsuario } from '../../context/UsuarioContext.jsx'
import './misTurnosPage.css'
import ModalCancelarTurno from '../../components/modal/ModalDeCancelar.jsx'

const MisTurnosPage = () => {
  const [turnos, setTurnos] = useState([])
  const { usuario } = useUsuario()
  const [cargando, setCargando] = useState(false)
  const { cargandoUsuario } = useUsuario()
  const [mostrarModalCancelar, setMostrarModalCancelar] = useState(false)
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null)

  const cargarTurnos = async () => {
    setCargando(true)
    try {
      const response = await getMisTurns(usuario._id)
      setTurnos(response.data)
    } catch (error) {
      console.error('Error al cargar turnos reservados:', error)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    if (cargandoUsuario) return
    cargarTurnos()
  }, [cargandoUsuario])

  const abrirModalCancelar = (turno) => {
    setTurnoSeleccionado(turno)
    setMostrarModalCancelar(true)
  }

  const cerrarModalCancelar = () => {
    setMostrarModalCancelar(false)
    setTurnoSeleccionado(null)
  }

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  const formatearHora = (fecha) =>
    new Date(fecha).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  const textoEstado = {
    reservado: 'Reservado',
    confirmado: 'Confirmado',
  }

  return (
    <Box className="app-view-container">
      <Typography variant="h4" className="page-title">
        Mis turnos reservados
      </Typography>
      {turnos.length === 0 ? (
        <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
          No tenés turnos reservados.
        </Typography>
      ) : (
        turnos.map((turno) => (
          <Paper key={turno._id} className="tarjeta-turno-reservado" elevation={0}>
            <div className="turno-encabezado">
              <span className="fecha">{formatearFecha(turno.fechaHora)}</span>

              <span className="estado-etiqueta reserva-activa">{textoEstado[turno.estado]}</span>
            </div>

            <div className="turno-cuerpo">
              <h3>{turno.servicio.nombre}</h3>

              <p>
                <strong>Médico:</strong> {turno.medico.nombre}
              </p>

              <p>
                <strong>Sede:</strong> {turno.sede.nombre}
              </p>

              <p>
                <strong>Hora:</strong> {formatearHora(turno.fechaHora)} hs
              </p>

              <p>
                <strong>Duración:</strong> {turno.duracion} minutos
              </p>

              <p>
                <strong>Costo:</strong>{' '}
                {turno.costo || turno.costo === 0 ? `$${turno.costo}` : 'Sin costo'}
              </p>
            </div>

            <div className="contenedor-boton">
              <Button
                variant="contained"
                className="btn-cancelar"
                disableElevation
                onClick={() => abrirModalCancelar(turno)}
              >
                Cancelar turno
              </Button>
            </div>
          </Paper>
        ))
      )}

      {mostrarModalCancelar && (
        <ModalCancelarTurno
          onCerrar={cerrarModalCancelar}
          onAceptar={async (motivo) => {
            console.log('Entró a onAceptar')
            console.log('Motivo:', motivo)
            console.log('Turno:', turnoSeleccionado)
            try {
              await cancelarTurno(turnoSeleccionado._id, usuario._id, motivo)

              cerrarModalCancelar()

              cargarTurnos()
            } catch (error) {
              console.error(error)
            }
          }}
        />
      )}
    </Box>
  )
}

export default MisTurnosPage
