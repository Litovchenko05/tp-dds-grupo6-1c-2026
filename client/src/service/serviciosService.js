import apiClient from '../services/apiClient'

export const getEspecialidades = async () => {
  const response = await apiClient.get('/servicios/especialidades')
  return response.data
}

export const getPracticas = async () => {
  const response = await apiClient.get('/servicios/practicas')
  return response.data
}

export const getTodosLosServicios = async (page, especialidadId, practicaId) => {
  try {
    const response = await apiClient.get('/turnos/servicios', {
      params: { page, limit: 5, especialidadId, practicaId },
      headers: { 'Cache-Control': 'no-cache' },
    })
    return response.data
  } catch (error) {
    console.error('Error en el fetching de servicios:', error)
    throw error
  }
}
export const getServiciosEspecialidades = async (page, flagAll, idEspecialidad) => {
  try {
    const response = await apiClient.get(`/medicos/especialidades/${idEspecialidad}`, {
      params: {
        flagAll,
        page,
        limit: 8,
      },
      headers: { 'Cache-Control': 'no-cache' },
    })

    return response.data
  } catch (error) {
    console.error('Error en el fetching de servicios:', error)
    throw error
  }
}

export const getServiciosPracticas = async (page, flagAll, idPractica) => {
  try {
    const response = await apiClient.get(`/medicos/practicas/${idPractica}`, {
      params: {
        flagAll,
        page,
        limit: 8,
      },
      headers: { 'Cache-Control': 'no-cache' },
    })

    return response.data
  } catch (error) {
    console.error('Error en el fetching de servicios:', error)
    throw error
  }
}
