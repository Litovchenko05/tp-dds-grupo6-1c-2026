import { useCallback, useEffect, useState } from 'react'
import { getTurnosMedico } from '../services/medicoTurnos.api'

function useMedicoTurnos(medicoId) {
  const [turnos, setTurnos] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTurnos = useCallback(
    async (filters = {}) => {
      if (!medicoId) {
        setTurnos([])
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await getTurnosMedico(medicoId, filters)
        setTurnos(response?.data || [])
        setPagination(response?.pagination || null)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    },
    [medicoId]
  )

  useEffect(() => {
    fetchTurnos()
  }, [fetchTurnos])

  return { turnos, pagination, loading, error, refetch: fetchTurnos }
}

export default useMedicoTurnos
