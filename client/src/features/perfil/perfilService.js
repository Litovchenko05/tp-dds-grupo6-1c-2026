import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  }
}

export const perfilService = {
  actualizarObraSocialPaciente: async (idPaciente, dataPlan) => {
    const response = await axios.put(
      `${API_URL}/pacientes/${idPaciente}/obra-social`,
      dataPlan,
      getAuthHeaders()
    )
    return response.data
  },

  obtenerServiciosMedico: async (idMedico) => {
    const response = await axios.get(`${API_URL}/medicos/${idMedico}/servicios`, getAuthHeaders())
    return response.data
  },

  agregarServicioMedico: async (idMedico, nuevoServicio) => {
    const response = await axios.post(
      `${API_URL}/medicos/${idMedico}/servicios`,
      nuevoServicio,
      getAuthHeaders()
    )
    return response.data
  },

  eliminarServicioMedico: async (idMedico, idPrestacion) => {
    const response = await axios.delete(
      `${API_URL}/medicos/${idMedico}/servicios/${idPrestacion}`,
      getAuthHeaders()
    )
    return response.data
  },

  obtenerCatalogoServicios: async () => {
    const response = await axios.get(`${API_URL}/servicios`, getAuthHeaders())
    return response.data
  },
}
