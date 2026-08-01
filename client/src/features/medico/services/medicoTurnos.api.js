import apiClient from '../../../services/apiClient'

export async function getTurnosMedico(medicoId, params = {}) {
  const response = await apiClient.get(`/medicos/${medicoId}/turnos`, { params })
  return response.data
}

export async function getEstadisticasMedico(medicoId) {
  const response = await apiClient.get(`/medicos/${medicoId}/estadisticas`)
  return response.data
}

export async function cancelarTurno(medicoId, turnoId, motivo) {
  const response = await apiClient.patch(`/medicos/${medicoId}/turnos/${turnoId}`, { motivo })
  return response.data
}

export async function reactivarTurno(medicoId, turnoId) {
  const response = await apiClient.patch(`/medicos/${medicoId}/turnos/${turnoId}/reactivar`)
  return response.data
}

export async function marcarTurnoComoRealizado(medicoId, turnoId, notas = '') {
  const response = await apiClient.put(`/medicos/${medicoId}/turnos/${turnoId}`, {
    estado: 'REALIZADO',
    notas,
  })
  return response.data
}

export async function getHistorialPaciente(medicoId, pacienteId, params = {}) {
  const response = await apiClient.get(`/medicos/${medicoId}/pacientes/${pacienteId}/historial`, {
    params,
  })
  return response.data
}
