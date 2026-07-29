import { turnos } from '../mockData/turnosMock'
import axios from 'axios'

const REACT_APP_API_URL = process.env.REACT_APP_API_URL

export const getTurnsSlowly = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(turnos)
    }, 5000)
  })

export const getTurns = async (page, idUsuario, { sortBy, order } = {}) => {
  try {
    console.log(idUsuario)
    const response = await axios.get(`${REACT_APP_API_URL}/turnos`, {
      params: {
        idUsuario,
        page,
        limit: 8,
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
    const response = await axios.get(`${REACT_APP_API_URL}/turnos/${id}`)
    return response.data
  } catch (error) {
    console.error('Error en el fetching de turnos by id: ', error)
    throw error
  }
}

export const crearReserva = async (idUsuario, idTurno) => {
  try {
    await axios.post(`${REACT_APP_API_URL}/pacientes/${idUsuario}/turnos/${idTurno}`, {})
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
    const response = await axios.get(`${REACT_APP_API_URL}/turnos/filtered`, {
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
