import { MedicoRepository } from '../repositories/medico.repository.js'
import { Medico } from '../models/Medico.js'
import { DisponibilidadHoraria } from '../models/disponibilidadHoraria.js'
import { TurnoService } from './turno.service.js'
import { turnoRepository } from '../repositories/datosPrueba.enMemoria.js'
import { Especialidad } from '../models/Especialidad.js'
import { Practica } from '../models/Practica.js'
import { Sede } from '../models/Sede.js'

export class MedicoService {
  constructor({ medicoRepository, agendaService, turnoService }) {
    this.medicoRepository = medicoRepository
    this.turnoService = turnoService
    this.agendaService = agendaService
  }

  async createMedico(medicoData) {
    const { usuario, matricula, nombre, especialidades, practicas, sedes, disponibilidades } =
      medicoData

    if (
      !usuario ||
      !matricula ||
      !nombre ||
      !especialidades ||
      !practicas ||
      !sedes ||
      !disponibilidades
    ) {
      throw new ValidationError('Todos los campos son requeridos')
    }

    const existente = await this.medicoRepository.findByNombre(nombre)

    if (existente) {
      throw new Error('El médico ya existe')
    }

    // const nuevoMedico = new Medico(usuario, matricula, nombre, especialidades, practicas, sedes,disponibilidades);
    const nuevoMedico = {
      usuario,
      matricula,
      nombre,
      especialidades,
      practicas,
      sedes,
      disponibilidades,
    }
    const medicoGuardado = await this.medicoRepository.save(nuevoMedico)

    return this.#mapToDto(medicoGuardado)
  }

  async obtenerTodos() {
    const medicos = await this.medicoRepository.findAll()

    const medicosEnDTO = medicos.map((m) => {
      return this.#mapToDto(m)
    })

    return medicosEnDTO
  }

  async obtenerPorId(id) {
    const medico = await this.medicoRepository.findById(id)

    return medico ? this.#mapToDto(medico) : null
  }

  async agregarDisponibilidad(medicoId, disponibilidadCompleta) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

      //le agrego la disponibilidad al doc del medico

      const nuevaDisponibilidad = disponibilidadCompleta.disponibilidadHoraria

      medico.agregarDisponibilidad(nuevaDisponibilidad)
      // medico.disponibilidades.push(nuevaDisponibilidad);

      //persisto en mongo
      await medico.save()

      console.log(
        'Nueva disponibilidad agregada: ' +
          medico.disponibilidades[medico.disponibilidades.length - 1]
      )

      const nuevaDisponibilidadObj = medico.disponibilidades[medico.disponibilidades.length - 1]

      //  const objMedico = this.mapToEntidad(medico);

      // const objNuevaDisponibilidad = new DisponibilidadHoraria(
      //                                 nuevaDisponibilidad.diaSemana,
      //                                 nuevaDisponibilidad.horaDesde,
      //                                 nuevaDisponibilidad.horaHasta
      //                               );

      const objSede = new Sede(
        disponibilidadCompleta.sede.nombre,
        disponibilidadCompleta.sede.direccion
      )

      if (disponibilidadCompleta.servicio.codigo == undefined) {
        //es una especialidad
        const especialidadObj = new Especialidad(
          disponibilidadCompleta.servicio.nombre,
          disponibilidadCompleta.servicio.duracionTurnoEnMins,
          disponibilidadCompleta.servicio.costo
        )

        setImmediate(() => {
          this.generarTurnosPorAnio(medico, nuevaDisponibilidadObj, objSede, especialidadObj)
        })
      } else {
        const practicaObj = new Practica(
          disponibilidadCompleta.servicio.codigo,
          disponibilidadCompleta.servicio.nombre,
          disponibilidadCompleta.servicio.duracionTurnoEnMins,
          disponibilidadCompleta.servicio.costo
        )

        setImmediate(() => {
          this.generarTurnosPorAnio(medico, nuevaDisponibilidadObj, objSede, practicaObj)
        })
      }

      return medico
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async generarTurnosPorAnio(medico, disponibilidad, sede, servicio) {
    try {
      this.agendaService.generarTurnosParaDisponibilidad(medico, disponibilidad, sede, servicio)
    } catch (error) {
      throw new Error('error al delegar la generación de turnos por disponibildad al serviceAgenda')
    }
  }

  async modificarDisponibilidad(medicoId, disponibilidadId, nuevaDisponibilidad) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

      const disponibilidad = medico.disponibilidades.id(disponibilidadId)

      console.log('id de la disponibilidad a modificar: ' + disponibilidadId)
      // const disponibilidad = medico.id(idDisponibilidad);
      // console.log("disponibilidad encontrada: " + disponibilidad);
      if (!disponibilidad) {
        throw new Error('Disponibilidad no encontrada')
      }

      const disponibilidadAnteriorObj = new DisponibilidadHoraria(
        disponibilidad.diaSemana,
        disponibilidad.horaDesde,
        disponibilidad.horaHasta
      )
      const nuevaDisponibilidadObj = new DisponibilidadHoraria(
        nuevaDisponibilidad.diaSemana,
        nuevaDisponibilidad.horaDesde,
        nuevaDisponibilidad.horaHasta
      )

      if (nuevaDisponibilidad.diaSemana != undefined) {
        disponibilidad.diaSemana = nuevaDisponibilidad.diaSemana
      }
      if (nuevaDisponibilidad.horaDesde != undefined) {
        disponibilidad.horaDesde = nuevaDisponibilidad.horaDesde
      }
      if (nuevaDisponibilidad.horaHasta != undefined) {
        disponibilidad.horaHasta = nuevaDisponibilidad.horaHasta
      }
      await medico.save()

      setImmediate(() => {
        this.generarTurnosPorAnioParaDisponibilidadModificada(
          medico,
          disponibilidadAnteriorObj,
          nuevaDisponibilidadObj
        )
      })

      return medico
    } catch (error) {
      throw new Error(error.message)
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
  mapToEntidad(medico) {
    generarTurnosPorAnioParaDisponibilidadModificada(
      medico,
      disponibilidadAnterior,
      disponibilidadModificada
    )
    {
      this.agendaService.cambiarTurnosPorDisponibilidadModificada(
        medico,
        disponibilidadAnterior,
        disponibilidadModificada
      )
    }
  }

  mapToEntidad(medico) {
    const objEspecialidades = (medico.especialidades || []).map(
      (e) => new Especialidad(e.nombre, e.duracionTurnoEnMins, e.costoConsulta)
    )
    const objPracticas = (medico.practicas || []).map(
      (p) => new Practica(p.codigo, p.nombre, p.duracionTurnoEnMins, p.costo)
    )
    const objSede = (medico.sedes || []).map((s) => new Sede(s.nombre, s.direccion))
    const objDisponibilidades = (medico.disponibilidades || []).map(
      (d) => new DisponibilidadHoraria(d.diaSemana, d.horaDesde, d.horaHasta)
    )
    const objMedico = new Medico(
      medico.usuario,
      medico.matricula,
      medico.nombre,
      objEspecialidades,
      objPracticas,
      objSede,
      objDisponibilidades
    )
    objMedico.setId(medico._id)

    console.log(objMedico.getId())

    return objMedico
  }

  async obtenerServicios(medicoId) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

      return {
        medico: {
          id: medico._id,
          nombre: medico.nombre,
        },
        especialidades: medico.especialidades || [],
        practicas: medico.practicas || [],
      }
    } catch (error) {
      throw error
    }
  }

  async findAllPaginated(page, limit) {
    return await this.medicoRepository.findAllPaginated(page, limit)
  }
  async agregarServicio(medicoId, servicioId, tipo) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

      // Validar tipo
      if (tipo !== 'especialidad' && tipo !== 'practica') {
        throw new Error('Tipo debe ser "especialidad" o "practica"')
      }

      const campo = tipo === 'especialidad' ? 'especialidades' : 'practicas'
      const servicios = medico[campo] || []

      // Validar que el servicio no esté ya agregado
      if (servicios.some((s) => s._id.toString() === servicioId)) {
        throw new Error(`Este ${tipo} ya está asociado al médico`)
      }

      // Agregar el servicio
      servicios.push({ _id: servicioId })
      medico[campo] = servicios
      await medico.save()

      return medico
    } catch (error) {
      throw error
    }
  }

  async removerServicio(medicoId, servicioId) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

      // Buscar en especialidades
      const especialidadIdx = (medico.especialidades || []).findIndex(
        (e) => e._id.toString() === servicioId
      )

      // Buscar en prácticas
      const practicaIdx = (medico.practicas || []).findIndex((p) => p._id.toString() === servicioId)

      if (especialidadIdx === -1 && practicaIdx === -1) {
        throw new Error('Servicio no encontrado en el médico')
      }

      if (especialidadIdx !== -1) {
        medico.especialidades.splice(especialidadIdx, 1)
      } else {
        medico.practicas.splice(practicaIdx, 1)
      }

      await medico.save()

      return medico
    } catch (error) {
      throw error
    }
  }

  async obtenerDisponibilidad(medicoId, filtros = {}) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

      let disponibilidades = medico.disponibilidades || []

      // Aplicar filtros si es necesario
      if (filtros.especialidad) {
        disponibilidades = disponibilidades.filter((d) => d.especialidad === filtros.especialidad)
      }

      if (filtros.practica) {
        disponibilidades = disponibilidades.filter((d) => d.practica === filtros.practica)
      }

      return {
        medico: {
          id: medico._id,
          nombre: medico.nombre,
        },
        disponibilidades: disponibilidades,
      }
    } catch (error) {
      throw error
    }
  }

  async obtenerHistorialPaciente(medicoId, pacienteId, filtros = {}) {
    try {
      const medico = await this.medicoRepository.findById(medicoId)

      if (!medico) {
        throw new Error('Médico no encontrado')
      }

      // Aquí necesitaríamos acceso a turnos del repositorio
      // Por ahora retornamos estructura esperada
      return {
        paciente: {
          id: pacienteId,
        },
        historial: [],
        estadisticas: {
          totalTurnos: 0,
          realizados: 0,
          cancelados: 0,
        },
      }
    } catch (error) {
      throw error
    }
  }
}
