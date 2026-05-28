import { MedicoRepository } from '../repositories/medico.repository.js'
import { Medico } from '../models/Medico.js'
import { DisponibilidadHoraria } from '../models/disponibilidadHoraria.js'
import { TurnoService } from './turno.service.js'
import { turnoRepository } from '../repositories/datosPrueba.enMemoria.js'

export class MedicoService {
  constructor({ medicoRepository, agendaService, turnoService}) {
    this.medicoRepository = new medicoRepository()
    this.turnoService = turnoService
    this.agendaService = agendaService
  }

  #mapToDto(m) {
    return {
      id:  m._id,
      usuario: m.usuario,
      matricula: m.matricula,
      nombre: m.nombre,
      especialidades: Array.isArray(m.especialidades)
        ? m.especialidades.map((e) => ({
            id: e._id,
            nombre: e.nombre,
            duracionTurnoEnMins: e.duracionTurnoEnMins,
            costo: e.costo,
          }))
        : [],
      practicas: Array.isArray(m.practicas)
        ? m.practicas.map((p) => ({
            id: p._id,
            codigo: p.codigo,
            nombre: p.nombre,
            duracionTurnoEnMins: p.duracionTurnoEnMins,
            costo: p.costo,
          }))
        : [],
      sedes: Array.isArray(m.sedes)
        ? m.sedes.map((s) => ({
            id: s._id,
            nombre: s.nombre,
            direccion: s.direccion,
          }))
        : [],
      disponibilidades: Array.isArray(m.disponibilidades)
        ? m.disponibilidades.map((d) => ({
            diaSemana: d.diaSemana,
            horaDesde: d.horaDesde,
            horaHasta: d.horaHasta,
          }))
        : [],
    }
  }

  async createMedico(medicoData){
    
    const {usuario, matricula, nombre, especialidades, practicas, sedes, disponibilidades} = medicoData;

       if (!usuario || !matricula || !nombre || !especialidades || !practicas || !sedes || !disponibilidades) {
          throw new ValidationError('Todos los campos son requeridos');
       }

    const existente = await this.medicoRepository.findByNombre(nombre); 

        if (existente) {
          throw new Error ('El médico ya existe');
        }

    const nuevoMedico = new Medico(usuario, matricula, nombre, especialidades, practicas, sedes,disponibilidades);
    const medicoGuardado = await this.medicoRepository.save(nuevoMedico);

    return this.#mapToDto(medicoGuardado);
  }

  async obtenerTodos() {
    const medicos = await this.medicoRepository.findAll()

    const medicosEnDTO = medicos.map(m => {
     return this.#mapToDto(m);
    });
    
     return medicosEnDTO;
  }

  obtenerPorId(id) {
    const medico = this.medicoRepository.obtenerPorId(Number(id))

    return medico ? this.#mapToDto(medico) : null
  }

  agregarDisponibilidad(medicoId, disponibilidad) {
    try {
      const medico = this.medicoRepository.obtenerPorId(Number(medicoId))

      if (!medico) {
        throw new Error('Médico no encontrado')
      }
      const nuevaDisponibilidad = new DisponibilidadHoraria(
        disponibilidad.diaSemana,
        disponibilidad.horaDesde,
        disponibilidad.horaHasta
      )
      medico.definirDisponibilidad(nuevaDisponibilidad)

      setImmediate(() => {
        this.generarTurnosPorAnio(medico, nuevaDisponibilidad)
      })
    } catch (error) {
      throw new Error('error en agregar disponibilidad para el médico')
    }
  }

  async generarTurnosPorAnio(medico, disponibilidad) {
    try {
      this.agendaService.generarTurnosParaDisponibilidad(medico, disponibilidad)
    } catch (error) {
      throw new Error('error al delegar la generación de turnos por disponibildad al serviceAgenda')
    }
  }

  modificarDisponibilidad(medicoId, disponibilidadId, nuevaDisponibilidad) {
    try {
      const medico = this.medicoRepository.obtenerPorId(Number(medicoId))

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

      if (disponibilidadId < 0 || disponibilidadId >= medico.disponibilidades.length) {
        throw new Error('Disponibilidad no encontrada para el médico')
      }

      const disponibilidadAnterior = medico.disponibilidades[disponibilidadId]

      const disponibilidadNuevaObj = new DisponibilidadHoraria(
        nuevaDisponibilidad.diaSemana,
        nuevaDisponibilidad.horaDesde,
        nuevaDisponibilidad.horaHasta
      )

      console.log(
        'Disponibilidad existente antes de la modificación: ',
        disponibilidadAnterior.diaSemana +
          ' ' +
          disponibilidadAnterior.horaDesde +
          ' - ' +
          disponibilidadAnterior.horaHasta
      )

      medico.modificarDisponibilidad(disponibilidadId, disponibilidadNuevaObj)

      console.log(
        'Disponibilidad existente después de la modificación: ',
        medico.disponibilidades[disponibilidadId].diaSemana +
          ' ' +
          medico.disponibilidades[disponibilidadId].horaDesde +
          ' - ' +
          medico.disponibilidades[disponibilidadId].horaHasta
      )

      setImmediate(() => {
        this.generarTurnosPorAnioParaDisponibilidadModificada(
          medico,
          disponibilidadAnterior,
          disponibilidadNuevaObj
        )
      })
    } catch (error) {
      throw new Error('Error en modificar disponibilidad para el médico')
    }
  }

  generarTurnosPorAnioParaDisponibilidadModificada(
    medico,
    disponibilidadAnterior,
    disponibilidadModificada
  ) {
    this.agendaService.cambiarTurnosPorDisponibilidadModificada(
      medico,
      disponibilidadAnterior,
      disponibilidadModificada
    )
  }

  #normalizarTexto(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
  }

  obtenerDisponibilidadesPorTipoServicio(medicoId, tipoServicio) {
  const medico = this.medicoRepository.obtenerPorId(Number(medicoId))

  if (!medico) {
    throw new Error('Médico no encontrado')
  }

  const servicioBuscado = this.#normalizarTexto(tipoServicio)

  if (!medico.tieneServicio(tipoServicio)) {
    throw new Error('El médico no atiende el servicio solicitado')
  }

  return this.agendaService.obtenerDisponiblesSegunMedicoYServicio(medicoId, tipoServicio)
  }

  solicitarCambioFecha(idUsuario, idTurno, nuevaFechaHora) {
    const resultado = this.turnoService.solicitarCambioDeFecha(idUsuario, idTurno, nuevaFechaHora)
    return resultado
  }
}
