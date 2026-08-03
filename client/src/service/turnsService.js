import { turnos } from '../mockData/turnosMock'
import apiClient from '../services/apiClient'

export const getTurnsSlowly = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(turnos)
    }, 5000)
  })

export const getTurns = async (page, idUsuario, { sortBy, order } = {}) => {
  try {
    const response = await apiClient.get('/turnos', {
      params: {
        idUsuario,
        page,
        limit: 15,
        sortBy,
        order,
      },
      headers: { 'Cache-Control': 'no-cache' },
    })

    return response.data
  } catch (error) {
    console.error('Error en el fetching de turnos:', error)
    throw error
  }
}

export const getTurnById = async (id) => {
  try {
    const response = await apiClient.get(`/turnos/${id}`)
    return response.data
  } catch (error) {
    console.error('Error en el fetching de turnos by id: ', error)
    throw error
  }
}

export const crearReserva = async (idUsuario, idTurno) => {
  try {
    await apiClient.post(`/pacientes/${idUsuario}/turnos/${idTurno}`, {})
    return
  } catch (error) {
    console.error('Error creando reservación: ', error)
    throw error
  }
}

export const getTurnsFiltered = async (
  idUsuario,
  {
    nombreMedico,
    idServicio,
    idSede,
    fechaDesde,
    fechaHasta,
    tipoServicio,
    page = 1,
    limit = 8,
    sortBy,
    order,
  }
) => {
  try {
    const response = await apiClient.get('/turnos/filtered', {
      params: {
        idUsuario,
        nombreMedico,
        idServicio,
        idSede,
        fechaDesde,
        fechaHasta,
        tipoServicio,
        page,
        limit,
        sortBy,
        order,
      },
      headers: {
        'Cache-Control': 'no-cache',
      },
    })

    return response.data
  } catch (error) {
    console.error('Error en el fetching de turnos filtrados:', error)
    throw error
  }
}

export const getMisTurns = async (idUsuario) => {
  try {
    const response = await apiClient.get(`/turnos/${idUsuario}/reservados`)

    return response.data
  } catch (error) {
    console.error('Error en el fetching de turnos:', error)
    throw error
  }
}

export const cancelarTurno = async (idTurno, idUsuario, motivo) => {
  try {
    const response = await apiClient.patch(`/turnos/${idTurno}/cancelar`, {
      idUsuario,
      motivo,
    })

    return
  } catch (error) {
    console.error('Error cancelando un turno:', error)

    if (error.response) {
      console.log(error.response.status)
      console.log(error.response.data)
    }
    throw error
  }
}

export const historial = async (id) => {
  try {
    const response = await apiClient.get(`/pacientes/${id}/historial`)

    return response
  } catch (error) {
    console.error('Error con el historial de un paciente:', error)

    if (error.response) {
      console.log(error.response.status)
      console.log(error.response.data)
    }
    throw error
  }
}
