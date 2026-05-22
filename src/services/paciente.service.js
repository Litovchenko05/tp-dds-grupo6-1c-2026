import { EstadoTurno } from '../models/estadoTurno.enum.js'
import { Paciente } from '../models/paciente.js'
import { Turno } from '../models/turno.js'
import { PacienteRepository } from '../repositories/paciente.repository.js'
import { TurnoRepository } from '../repositories/turno.repository.js'
import { Medico } from '../models/Medico.js'

export class PacienteService {
  constructor({ turnoRepository }) {
    this.pacienteRepository = new PacienteRepository([
      new Paciente(1, 'juan123', '40111222', 'Juan Pérez', 'OSDE', '210'),

      new Paciente(2, 'maria_lopez', '38999111', 'María López', 'Swiss Medical', 'SMG20'),

      new Paciente(3, 'carlos.dev', '41222333', 'Carlos Gómez', 'Galeno', 'Oro'),

      new Paciente(4, 'ana_romero', '42777888', 'Ana Romero', 'Medifé', 'Plata'),

      new Paciente(5, 'lucia99', '39888777', 'Lucía Fernández', null, null),
    ])
    this.turnoRepository = turnoRepository
  }

  reservarTurno(pacienteId, turnoId) {
    const paciente = this.pacienteRepository.obtenerPorId(Number(pacienteId))
    if (!paciente) {
      throw new Error('Paciente no encontrado')
    }
    const turno = this.turnoRepository.obtenerPorId(Number(turnoId))

    if (!turno) {
      throw new Error('Turno no encontrado')
    }
    if (turno.estado == EstadoTurno.DISPONIBLE) {
      turno.reservar(paciente)
      paciente.guardarTurnoEnHistorial(turno)
      console.log(
        'Se reservó el turno ' +
          turno.id +
          ' con el médico ' +
          turno.medico.nombre +
          ' para el paciente ' +
          turno.paciente.nombre
      )
    } else {
      throw new Error('El turno no está disponible para reservar')
    }
  }

  consultarHistorial(pacienteId) {
    const paciente = this.pacienteRepository.obtenerPorId(Number(pacienteId))
    if (!paciente) {
      throw new Error('Paciente no encontrado')
    }
    const historial = paciente.historialDeTurnos.map((turno) => turno.toJSON())
    return historial
  }

  solicitarCambioDeFecha(pacienteId, turnoId, nuevaFechaHora) {
    const paciente = this.pacienteRepository.obtenerPorId(Number(pacienteId))
    if (!paciente) {
      throw new Error('Paciente no encontrado')
    }
    const turno = this.turnoRepository.obtenerPorId(Number(turnoId))
    // console.log("Se soliitó el cambio de fecha para el turno " + turnoId + " con el médico " + turno.medico.nombre + " del paciente " + paciente.nombre);
    if (!turno) {
      throw new Error('Turno no encontrado')
    }
    paciente.solicitarCambioDeFechaTurno(turno, nuevaFechaHora, turno.medico)
  }
}
