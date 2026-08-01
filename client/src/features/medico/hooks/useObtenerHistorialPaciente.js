import { useState } from 'react'
import { getHistorialPaciente } from '../services/medicoTurnos.api'

function useObtenerHistorialPaciente() {
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const obtenerHistorial = async (medicoId, pacienteId, filtros = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await getHistorialPaciente(medicoId, pacienteId, filtros)
      const data = response?.data || []
      setHistorial(data)
      return data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { historial, loading, error, obtenerHistorial }
}

export default useObtenerHistorialPaciente
