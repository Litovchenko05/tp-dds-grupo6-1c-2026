import apiClient from '../../../services/apiClient'

export async function getTurnosMedico(params = {}) {
  const response = await apiClient.get('/medico/turnos', { params })
  return response.data
}

export async function cancelarTurno(turnoId, motivo) {
  const response = await apiClient.patch(`/turnos/${turnoId}/cancelar`, { motivo })
  return response.data
}

export async function marcarTurnoComoRealizado(turnoId) {
  const response = await apiClient.patch(`/turnos/${turnoId}/realizado`)
  return response.data
}
