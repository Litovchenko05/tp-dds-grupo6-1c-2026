import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
}

export const pacienteService = {
  obtenerCobertura: async (idPaciente) => {
    const response = await axios.get(
      `${API_URL}/pacientes/${idPaciente}/cobertura`,
      getAuthHeaders()
    )
    return response.data.data
  },

  actualizarCobertura: async (idPaciente, coberturaData) => {
    const response = await axios.put(
      `${API_URL}/pacientes/${idPaciente}/cobertura`,
      coberturaData,
      getAuthHeaders()
    )
    return response.data
  },

  getObrasSociales: async () => {
    const response = await axios.get(`${API_URL}/obraSocial`)
    return response.data
  },

  getPlanes: async () => {
    const response = await axios.get(`${API_URL}/plan`)
    return response.data
  },
}
