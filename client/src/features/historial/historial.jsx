import { useEffect, useState } from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { historial } from '../../service/turnsService'
import { useUsuario } from '../../context/UsuarioContext.jsx'
import './historial.css'

const HistorialTurnosPage = () => {
  const [turnos, setTurnos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const { usuario, cargandoUsuario } = useUsuario()

  useEffect(() => {
    if (cargandoUsuario) return // esperamos a que UsuarioContext resuelva

    const cargarHistorial = async () => {
      setCargando(true)
      try {
        const response = await historial(usuario._id)
        setTurnos(response.data.data)
      } catch (err) {
        setError('No se pudo cargar el historial de turnos.')
      } finally {
        setCargando(false)
      }
    }

    cargarHistorial()
  }, [usuario, cargandoUsuario])

  const formatearFecha = (fechaHora) => {
    const fecha = new Date(fechaHora)
    return fecha.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatearHora = (fechaHora) => {
    const fecha = new Date(fechaHora)
    return fecha.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const formatearCosto = (costo) => {
    if (costo === null || costo === undefined) return 'Sin costo'
    return `$${costo.toLocaleString('es-AR')}`
  }

  const claseYTextoEstado = (estado) => {
    const mapa = {
      cancelado: { clase: 'CANCELADO', etiqueta: 'etiqueta-cancelado', texto: 'CANCELADO' },
      realizado: { clase: 'REALIZADO', etiqueta: 'etiqueta-completado', texto: 'REALIZADO' },
    }
    return mapa[estado] || { clase: '', etiqueta: '', texto: estado }
  }

  if (error) {
    return (
      <Box className="app-view-container">
        <Typography variant="h4" className="page-title">
          Historial de Turnos
        </Typography>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <Box className="app-view-container">
      <Typography variant="h4" className="page-title">
        Historial de Turnos
      </Typography>

      {turnos.length === 0 ? (
        <Typography>No tenés turnos en tu historial todavía.</Typography>
      ) : (
        turnos.map((turno) => {
          const { clase, etiqueta, texto } = claseYTextoEstado(turno.estado)

          return (
            <Paper key={turno._id} className={`tarjeta-turno ${clase}`} elevation={0}>
              <div className="turno-encabezado">
                <span className="fecha">{formatearFecha(turno.fechaHora)}</span>
                <span className={`estado ${etiqueta}`}>{texto}</span>
              </div>
              <div className="turno-cuerpo">
                <h3>{turno.servicio?.nombre}</h3>
                <p>
                  <strong>Médico:</strong> {turno.medico?.nombre}
                </p>
                <p>
                  <strong>Sede:</strong> {turno.sede?.nombre}
                </p>
                <p>
                  <strong>Hora:</strong> {formatearHora(turno.fechaHora)} hs
                </p>
                <p>
                  <strong>Costo:</strong> {formatearCosto(turno.costo)}
                </p>
              </div>
            </Paper>
          )
        })
      )}
    </Box>
  )
}

export default HistorialTurnosPage
