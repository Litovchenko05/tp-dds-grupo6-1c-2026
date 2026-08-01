import { useCallback, useEffect, useState } from 'react'
import { getEstadisticasMedico } from '../services/medicoTurnos.api'

function useMedicoDashboardData(medicoId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    if (!medicoId) {
      setData(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await getEstadisticasMedico(medicoId)
      setData(response?.data || null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [medicoId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}

export default useMedicoDashboardData
