import { useState } from 'react'
import { marcarTurnoComoRealizado } from '../services/medicoTurnos.api'

function useMarcarRealizadoTurno() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const marcarRealizado = async (medicoId, turnoId, notas = '') => {
    try {
      setLoading(true)
      setError(null)
      return await marcarTurnoComoRealizado(medicoId, turnoId, notas)
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { marcarRealizado, loading, error }
}

export default useMarcarRealizadoTurno
