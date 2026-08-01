import axios from 'axios'

export class AuthService {
  constructor({
    usuarioService,
    pacienteService,
    medicoService,
    pacienteRepository,
    medicoRepository,
  }) {
    this.usuarioService = usuarioService
    this.pacienteService = pacienteService
    this.medicoService = medicoService
    this.pacienteRepository = pacienteRepository
    this.medicoRepository = medicoRepository
  }

  async #getAdminToken() {
    const params = new URLSearchParams()
    params.append('client_id', process.env.KEYCLOAK_ADMIN_CLIENT_ID)
    params.append('username', process.env.KEYCLOAK_ADMIN_USERNAME)
    params.append('password', process.env.KEYCLOAK_ADMIN_PASSWORD)
    params.append('grant_type', 'password')

    const response = await axios.post(
      `${process.env.KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token`,
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    return response.data.access_token
  }

  async #asignarRolKeycloak(keycloakId, roleName, adminToken) {
    const realm = process.env.KEYCLOAK_REALM
    const baseUrl = process.env.KEYCLOAK_BASE_URL

    const roleResponse = await axios.get(`${baseUrl}/admin/realms/${realm}/roles/${roleName}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    const roleConfig = roleResponse.data

    await axios.post(
      `${baseUrl}/admin/realms/${realm}/users/${keycloakId}/role-mappings/realm`,
      [roleConfig],
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
  }

  async registrarUsuario(datosValidados) {
    const { username, password, name, role, dni, matricula } = datosValidados

    if (role === 'paciente') {
      const existePaciente = await this.pacienteRepository.findByDni(dni)
      if (existePaciente) {
        const error = new Error('Este DNI ya se encuentra registrado en el sistema.')
        error.field = 'dni'
        throw error
      }
    } else if (role === 'medico') {
      const existeMedico = await this.medicoRepository.findByMatricula(matricula)
      if (existeMedico) {
        const error = new Error('Esta matrícula ya se encuentra registrada.')
        error.field = 'matricula'
        throw error
      }
    }

    const adminToken = await this.#getAdminToken()

    const userPayload = {
      username: username,
      enabled: true,
      firstName: name,
      credentials: [
        {
          type: 'password',
          value: password,
          temporary: false,
        },
      ],
    }

    const response = await axios.post(
      `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
      userPayload,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const locationHeader = response.headers['location']
    const keycloakId = locationHeader.split('/').pop()

    await this.#asignarRolKeycloak(keycloakId, role, adminToken)

    try {
      const nuevoUsuario = await this.usuarioService.crearUsuario({
        username,
        keycloakId,
      })

      if (role === 'paciente') {
        await this.pacienteService.createPaciente({
          usuario: nuevoUsuario._id,
          dni: dni,
          nombre: name,
        })
      } else if (role === 'medico') {
        await this.medicoService.createMedico({
          usuario: nuevoUsuario._id,
          matricula: matricula,
          nombre: name,
        })
      }

      return nuevoUsuario
    } catch (error) {
      await axios.delete(
        `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${keycloakId}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      )

      throw new Error(error)
    }
  }

  async obtenerPerfilDelUsuario(usuarioMongoId, usuarioRol) {
    if (!usuarioMongoId || !usuarioRol) {
      throw new Error('No se pudo determinar el usuario autenticado o su rol.')
    }

    if (usuarioRol === 'paciente') {
      const paciente = await this.pacienteRepository.findByUsuario(usuarioMongoId)

      if (!paciente) {
        throw new Error('Paciente no encontrado para el usuario autenticado.')
      }

      return {
        usuarioMongoId,
        pacienteId: paciente._id,
        dni: paciente.dni,
      }
    }

    if (usuarioRol === 'medico') {
      const medico = await this.medicoRepository.findByUsuario(usuarioMongoId)

      if (!medico) {
        throw new Error('Médico no encontrado para el usuario autenticado.')
      }

      return {
        usuarioMongoId,
        medicoId: medico._id,
        matricula: medico.matricula,
      }
    }

    throw new Error('El rol del usuario autenticado no es válido.')
  }
}
