import { EstadoTurno } from '../models/estadoTurno.enum.js'
import { Paciente } from '../models/paciente.js'
import { Turno } from '../models/turno.js'
import { PacienteRepository } from '../repositories/paciente.repository.js'
import { TurnoRepository } from '../repositories/turno.repository.js'
import { Medico } from '../models/Medico.js'
import { ObraSocial } from '../models/ObraSocial.js'
import { Plan } from '../models/Plan.js'
import { MedicoRepository } from '../repositories/medico.repository.js'
export class PacienteService {
  
  constructor() {
    this.pacienteRepository = new PacienteRepository()
    this.turnoRepository = new TurnoRepository()
    this.medicoRespository = new MedicoRepository()
  }

  async createPaciente(pacienteData){
    
    const {dni, nombre, obraSocial, usuario ,plan} = pacienteData;

       if (!usuario || !dni || !nombre || !obraSocial || !plan) {
          throw new ValidationError('Todos los campos son requeridos');
       }

    const existente = await this.pacienteRepository.findByDni(pacienteData.dni); 

        if (existente) {
          throw new Error ('El Paciente ya existe');
        }

    const nuevoPaciente = {dni, nombre, obraSocial, usuario ,plan};
   
    const pacienteGuardado = await this.pacienteRepository.save(nuevoPaciente);

    return pacienteGuardado;
  }

  async obtenerTodos() {
    const pacientes = await this.pacienteRepository.findAll()

     return pacientes;
  }

  async obtenerPorId(id) {
    const paciente = await this.pacienteRepository.findById(id)

    return paciente;
  }


  async reservarTurno(pacienteId, turnoId) {
    
    const paciente = await  this.pacienteRepository.findById(pacienteId)
   
    if (!paciente) {
      throw new Error('Paciente no encontrado')
    }
    const turno = await this.turnoRepository.findById(turnoId)
   
    if (!turno) {
      throw new Error('Turno no encontrado')
    }
   
    if (turno.estado == "disponible") {

        turno.paciente = paciente;
        turno.estado = "reservado";
        turno.save()

        paciente.historialDeTurnos.push(turno);
        paciente.save()
    } else {
      throw new Error('El turno no está disponible para reservar')
    }
  }

  

  async consultarHistorial(pacienteId) {
    const paciente = await this.pacienteRepository.findById(pacienteId)
    if (!paciente) {
      throw new Error('Paciente no encontrado')
    }
    const historial = paciente.historialDeTurnos;
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

    const medico = await this.medicoRespository.findByNombre(turno.medico.nombre);

    medico.solicitudesDeCambioDeFecha.push ({
        nuevaFechaHora: new Date(nuevaFechaHora),
        estado: 'pendiente'
    });

    await medico.save();
    
  }

  async findAllPaginated(page, limit) {
      return await this.pacienteRepository
          .findAllPaginated(page, limit)
  }

}