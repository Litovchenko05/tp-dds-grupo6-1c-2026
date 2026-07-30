import axios from 'axios'

const REACT_APP_API_URL = process.env.REACT_APP_API_URL

export const getSedes = async () => {
  const response = await axios.get(`${REACT_APP_API_URL}/sedes`)
  return response.data
}
