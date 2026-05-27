import { EstadoTurno } from '../models/estadoTurno.enum.js'
import { Paciente } from '../models/paciente.js'
import { Turno } from '../models/turno.js'
import { PacienteRepository } from '../repositories/paciente.repository.js'
import { TurnoRepository } from '../repositories/turno.repository.js'
import { Medico } from '../models/Medico.js'

export class PacienteService {
  
  constructor() {
    this.pacienteRepository = new PacienteRepository()
    this.turnoRepository = new TurnoRepository()
  }

  #mapToDto(paciente) {
      return {
        id: paciente.id || paciente._id,
        dni: paciente.dni,
        usuario:paciente.usuario,
        nombre: paciente.nombre,
        obraSocial:{
            id: paciente.obraSocial._id,
            codigo: paciente.obraSocial.nombre,
            planes: Array.isArray(paciente.obraSocial.planes)
            ? paciente.obraSocial.planes.map((plan) => ({
            id: plan._id,
            nombre: plan.nombre,
            coberturasEspecialidad: plan.duracionTurnoEnMins,
            coberturasPractica: plan.coberturasPractica,
            }))
          :[],
          },
        plan: {
            id: paciente.plan._id,
            nombre: paciente.plan.nombre,
            coberturasEspecialidad: paciente.plan.duracionTurnoEnMins,
            coberturasPractica: paciente.plan.coberturasPractica,
        }
      };
  }

  
  async createPaciente(pacienteData){
    
    const {dni, nombre, obraSocial, usuario ,plan} = pacienteData;

       if (!usuario || !dni || !nombre || !obraSocial || !plan) {
          throw new ValidationError('Todos los campos son requeridos');
       }

    const existente = await this.pacienteRepository.findByDni(dni); 

        if (existente) {
          throw new Error ('El Paciente ya existe');
        }

    const nuevoPaciente = {dni, nombre, obraSocial, usuario ,plan};
   
    const pacienteGuardado = await this.pacienteRepository.save(nuevoPaciente);

    return this.#mapToDto(pacienteGuardado);
  }

  async obtenerTodos() {
    const pacientes = await this.pacienteRepository.findAll()

    const pacientesEnDTO = pacientes.map(p => {
     return this.#mapToDto(p);
    });
    
     return pacientesEnDTO;
  }

  async obtenerPorId(id) {
    const paciente = await this.pacienteRepository.findById(id)

    return paciente ? this.#mapToDto(paciente) : null
  }


  reservarTurno(pacienteId, turnoId) {
    const paciente = this.pacienteRepository.findById(Number(pacienteId))
    if (!paciente) {
      throw new Error('Paciente no encontrado')
    }
    const turno = this.turnoRepository.findById(Number(turnoId))

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
    const paciente = this.pacienteRepository.findById(Number(pacienteId))
    if (!paciente) {
      throw new Error('Paciente no encontrado')
    }
    const historial = paciente.historialDeTurnos.map((turno) => turno.toJSON())
    return historial
  }

  solicitarCambioDeFecha(pacienteId, turnoId, nuevaFechaHora) {
    const paciente = this.pacienteRepository.findById(Number(pacienteId))
    if (!paciente) {
      throw new Error('Paciente no encontrado')
    }
    const turno = this.turnoRepository.findById(Number(turnoId))
    // console.log("Se soliitó el cambio de fecha para el turno " + turnoId + " con el médico " + turno.medico.nombre + " del paciente " + paciente.nombre);
    if (!turno) {
      throw new Error('Turno no encontrado')
    }
    paciente.solicitarCambioDeFechaTurno(turno, nuevaFechaHora, turno.medico)
  }
}
