import { useEffect, useState } from 'react'
import { getTurnosMedico } from '../services/medicoTurnos.api'

function useMedicoTurnos(initialFilters = {}) {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTurnos = async (filters = initialFilters) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTurnosMedico(filters)
      setTurnos(Array.isArray(data) ? data : data?.turnos || [])
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTurnos(initialFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    turnos,
    loading,
    error,
    refetch: fetchTurnos,
  }
}

export default useMedicoTurnos
