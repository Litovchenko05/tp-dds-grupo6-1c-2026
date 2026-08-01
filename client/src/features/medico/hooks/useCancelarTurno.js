import { useState } from 'react'
import { cancelarTurno } from '../services/medicoTurnos.api'

function useCancelarTurno() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const cancelar = async (medicoId, turnoId, motivo) => {
    try {
      setLoading(true)
      setError(null)
      return await cancelarTurno(medicoId, turnoId, motivo)
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { cancelar, loading, error }
}

export default useCancelarTurno
