import axios from 'axios'

const REACT_APP_API_URL = process.env.REACT_APP_API_URL

export const getEspecialidades = async () => {
  const response = await axios.get(`${REACT_APP_API_URL}/servicios/especialidades`)
  return response.data
}

export const getPracticas = async () => {
  const response = await axios.get(`${REACT_APP_API_URL}/servicios/practicas`)
  return response.data
}

export const getTodosLosServicios = async (page, especialidadId, practicaId) => {
  try {
    const response = await axios.get(`${REACT_APP_API_URL}/turnos/servicios`, {
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
    const response = await axios.get(
      `${REACT_APP_API_URL}/medicos/especialidades/${idEspecialidad}`,
      {
        params: {
          flagAll,
          page,
          limit: 8,
        },
        headers: { 'Cache-Control': 'no-cache' },
      }
    )

    return response.data
  } catch (error) {
    console.error('Error en el fetching de servicios:', error)
    throw error
  }
}

export const getServiciosPracticas = async (page, flagAll, idPractica) => {
  try {
    const response = await axios.get(`${REACT_APP_API_URL}/medicos/practicas/${idPractica}`, {
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
