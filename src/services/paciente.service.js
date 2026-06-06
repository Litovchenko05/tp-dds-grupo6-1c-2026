import { EstadoTurno } from '../models/estadoTurno.enum.js'
export class PacienteService {

  constructor({ pacienteRepository, turnoRepository, medicoRepository, turnoService }) {
    this.pacienteRepository = pacienteRepository
    this.turnoRepository = turnoRepository
    this.medicoRepository = medicoRepository
    this.turnoService = turnoService
  }

  async createPaciente(pacienteData) {

    const { dni, nombre, obraSocial, usuario, plan } = pacienteData

    if (!usuario || !dni || !nombre || !obraSocial || !plan) {
      throw new ValidationError('Todos los campos son requeridos')
    }

    const existente = await this.pacienteRepository.findByDni(pacienteData.dni)

    if (existente) {
      throw new Error('El Paciente ya existe')
    }

    const nuevoPaciente = { dni, nombre, obraSocial, usuario, plan }

    const pacienteGuardado = await this.pacienteRepository.save(nuevoPaciente)

    return pacienteGuardado
  }

  async obtenerTodos() {
    const pacientes = await this.pacienteRepository.findAll()

    return pacientes
  }

  async obtenerPorId(id) {
    const paciente = await this.pacienteRepository.findById(id)

    return paciente
  }


  async reservarTurno(pacienteId, turnoId) {

    const paciente = await this.pacienteRepository.findById(pacienteId)

    if (!paciente) {
      throw new Error('Paciente no encontrado')
    }
    const turno = await this.turnoRepository.findById(turnoId)

    if (!turno) {
      throw new Error('Turno no encontrado')
    }

    //TODO DELEGAR EN TURNO SERVICE
    if (turno.estado == "DISPONIBLE") {

      turno.paciente = paciente
      turno.estado = EstadoTurno.DISPONIBLE
      turno.save()

      paciente.historialDeTurnos.push(turno)
      paciente.save()

      return turno
    } else {
      throw new Error('El turno no está disponible para reservar')
    }
  }

  async cancelarTurno(pacienteId, turnoId, motivo) {

    try {
      const paciente = await this.pacienteRepository.findById(pacienteId)

      if (!paciente) {
        throw new Error('Paciente no encontrado')
      }

      const turnoCancelado = await this.turnoService.cancelar(turnoId, paciente.usuario._id, motivo)

      return turnoCancelado
    }
    catch (error) {
      throw new Error('El turno no pudo ser cancelado')
    }
  }


  async consultarHistorial(pacienteId) {
    const paciente = await this.pacienteRepository.findById(pacienteId)
    if (!paciente) {
      throw new Error('Paciente no encontrado')
    }
    const historial = paciente.historialDeTurnos
    return historial
  }

  async solicitarCambioDeFecha(pacienteId, turnoId, nuevaFechaHora) {
    const paciente = await this.pacienteRepository.findById(pacienteId)

    if (!paciente) {
      throw new Error('Paciente no encontrado')
    }
    const turno = await this.turnoRepository.findById(turnoId)

    if (!turno) {
      throw new Error('Turno no encontrado')
    }

    const medico = await this.medicoRespository.findByNombre(turno.medico.nombre)


    medico.solicitudesDeCambioDeFecha.push({
      nuevaFechaHora: new Date(nuevaFechaHora),
      estado: 'pendiente'
    })

    await medico.save()

  }

  async findAllPaginated(page, limit) {
    return await this.pacienteRepository
      .findAllPaginated(page, limit)
  }

}