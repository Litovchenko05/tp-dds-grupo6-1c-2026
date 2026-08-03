import axios from 'axios'
import apiClient from '../../services/apiClient'

const KEYCLOAK_URL = process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8080'
const KEYCLOAK_REALM = process.env.REACT_APP_KEYCLOAK_REALM || 'sweet-medical'
const KEYCLOAK_CLIENT_ID = process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'sweet-medical-front'

async function loginEnKeycloak(username, password) {
  const params = new URLSearchParams()
  params.append('client_id', KEYCLOAK_CLIENT_ID)
  params.append('grant_type', 'password')
  params.append('username', username)
  params.append('password', password)

  const response = await axios.post(
    `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
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
    await apiClient.post('/auth/registro', payload)
    return await loginEnKeycloak(payload.username, payload.password)
  },
}
