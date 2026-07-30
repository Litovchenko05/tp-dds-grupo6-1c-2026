import axios from 'axios'

async function loginEnKeycloak(username, password) {
  const params = new URLSearchParams()
  params.append('client_id', 'sweet-medical-front')
  params.append('grant_type', 'password')
  params.append('username', username)
  params.append('password', password)

  const response = await axios.post(
    `${process.env.REACT_APP_KEYCLOAK_URL}/realms/sweet-medical/protocol/openid-connect/token`,
    params,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  )

  localStorage.setItem('token', response.data.access_token)
  localStorage.setItem('refresh_token', response.data.refresh_token)
  return response.data
}

export const authService = {
  async iniciarSesion({ username, password }) {
    return await loginEnKeycloak(username, password)
  },

  async registrarUsuario(payload) {
    await axios.post(`${process.env.REACT_APP_API_URL}/auth/registro`, payload)
    return await loginEnKeycloak(payload.username, payload.password)
  },
}
