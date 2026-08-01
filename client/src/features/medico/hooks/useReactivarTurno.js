import { useState } from 'react'
import { reactivarTurno } from '../services/medicoTurnos.api'

function useReactivarTurno() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const reactivar = async (medicoId, turnoId) => {
    try {
      setLoading(true)
      setError(null)
      return await reactivarTurno(medicoId, turnoId)
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { reactivar, loading, error }
}

export default useReactivarTurno
