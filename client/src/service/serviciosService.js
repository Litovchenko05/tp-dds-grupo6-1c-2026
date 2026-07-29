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
