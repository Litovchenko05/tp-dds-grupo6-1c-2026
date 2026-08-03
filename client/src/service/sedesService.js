import apiClient from '../services/apiClient'

export const getSedes = async () => {
  const response = await apiClient.get('/sedes')
  return response.data
}
