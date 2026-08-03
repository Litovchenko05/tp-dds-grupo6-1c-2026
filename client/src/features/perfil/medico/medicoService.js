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

export const medicoService = {
  obtenerServicios: async (idMedico) => {
    const response = await axios.get(`${API_URL}/medicos/${idMedico}/servicios`, getAuthHeaders())
    return response.data?.data || response.data || []
  },

  obtenerCatalogoServicios: async () => {
    const response = await axios.get(`${API_URL}/servicios`, getAuthHeaders())
    return response.data?.data || response.data || []
  },

  agregarServicio: async (idMedico, servicioData) => {
    const response = await axios.post(
      `${API_URL}/medicos/${idMedico}/servicios`,
      servicioData,
      getAuthHeaders()
    )
    return response.data.data
  },

  eliminarServicio: async (idMedico, idServicio, tipo) => {
    const response = await axios.delete(
      `${API_URL}/medicos/${idMedico}/servicios/${idServicio}?tipo=${tipo}`,
      getAuthHeaders()
    )
    return response.data
  },

  agregarDisponibilidad: async (idMedico, disponibilidadData) => {
    const response = await axios.post(
      `${API_URL}/medicos/${idMedico}/disponibilidades`,
      disponibilidadData,
      getAuthHeaders()
    )
    return response.data.data || response.data
  },

  obtenerSedes: async () => {
    const response = await axios.get(`${API_URL}/sedes`, getAuthHeaders())
    return response.data.data || response.data
  },

  actualizarDisponibilidad: async (idMedico, servicioId, servicioData) => {
    const response = await axios.patch(
      `${API_URL}/medicos/${idMedico}/disponibilidades/${servicioId}`,
      servicioData,
      getAuthHeaders()
    )
    return response.data.data || response.data
  },
  actualizarServicio: async (idMedico, idServicio, servicioData) => {
    console.log('id de servicio enviado desde el front:', idServicio)
    const response = await axios.put(
      `${API_URL}/medicos/${idMedico}/servicios/${idServicio}`,
      servicioData,
      getAuthHeaders()
    )
    return response.data.data || response.data
  },
}
