import { MedicoService } from '../medico.service.js'

// Mock del MedicoRepository
jest.mock('../../repositories/medico.repository.js', () => {
  return {
    MedicoRepository: jest.fn().mockImplementation(() => ({
      findById: jest.fn(),
      findByNombre: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
    })),
  }
})

// Mock del AgendaService
const mockAgendaService = {
  generarTurnosParaDisponibilidad: jest.fn(),
  cambiarTurnosPorDisponibilidadModificada: jest.fn(),
}

describe('MedicoService', () => {
  let medicoService
  let mockRepository

  beforeEach(() => {
    // Recrear la instancia para limpiar los mocks
    medicoService = new MedicoService({
      medicoRepository: require('../../repositories/medico.repository.js').MedicoRepository,
      agendaService: mockAgendaService,
    })
    mockRepository = medicoService.medicoRepository
    jest.clearAllMocks()
  })

  describe('obtenerServicios', () => {
    it('debe obtener servicios de un médico existente', async () => {
      const medicoId = '123'
      const medicoMock = {
        _id: medicoId,
        nombre: 'Dr. García',
        especialidades: [
          { _id: 'esp1', nombre: 'Cardiología' },
          { _id: 'esp2', nombre: 'Neurocirugía' },
        ],
        practicas: [{ _id: 'prac1', nombre: 'Ecocardiograma' }],
      }

      mockRepository.findById.mockResolvedValue(medicoMock)

      const resultado = await medicoService.obtenerServicios(medicoId)

      expect(resultado.medico.id).toBe(medicoId)
      expect(resultado.medico.nombre).toBe('Dr. García')
      expect(resultado.especialidades).toHaveLength(2)
      expect(resultado.practicas).toHaveLength(1)
      expect(mockRepository.findById).toHaveBeenCalledWith(medicoId)
    })

    it('debe lanzar error si médico no existe', async () => {
      mockRepository.findById.mockResolvedValue(null)

      await expect(medicoService.obtenerServicios('123')).rejects.toThrow('Médico no encontrado')
    })

    it('debe retornar arrays vacíos si no hay servicios', async () => {
      const medicoMock = {
        _id: '123',
        nombre: 'Dr. García',
      }

      mockRepository.findById.mockResolvedValue(medicoMock)

      const resultado = await medicoService.obtenerServicios('123')

      expect(resultado.especialidades).toEqual([])
      expect(resultado.practicas).toEqual([])
    })
  })

  describe('agregarServicio', () => {
    it('debe agregar una especialidad al médico', async () => {
      const medicoId = '123'
      const servicioId = 'esp456'
      const tipo = 'especialidad'

      const medicoMock = {
        _id: medicoId,
        nombre: 'Dr. García',
        especialidades: [{ _id: 'esp1' }],
        practicas: [],
        save: jest.fn().mockResolvedValue(true),
      }

      mockRepository.findById.mockResolvedValue(medicoMock)

      const resultado = await medicoService.agregarServicio(medicoId, servicioId, tipo)

      expect(resultado.especialidades).toHaveLength(2)
      expect(mockRepository.findById).toHaveBeenCalledWith(medicoId)
      expect(medicoMock.save).toHaveBeenCalled()
    })

    it('debe agregar una práctica al médico', async () => {
      const medicoId = '123'
      const servicioId = 'prac789'
      const tipo = 'practica'

      const medicoMock = {
        _id: medicoId,
        nombre: 'Dr. García',
        especialidades: [],
        practicas: [],
        save: jest.fn().mockResolvedValue(true),
      }

      mockRepository.findById.mockResolvedValue(medicoMock)

      const resultado = await medicoService.agregarServicio(medicoId, servicioId, tipo)

      expect(resultado.practicas).toHaveLength(1)
      expect(medicoMock.save).toHaveBeenCalled()
    })

    it('debe lanzar error si tipo no es válido', async () => {
      const medicoMock = {
        _id: '123',
        especialidades: [],
      }

      mockRepository.findById.mockResolvedValue(medicoMock)

      await expect(medicoService.agregarServicio('123', 'serv123', 'tipoInvalido')).rejects.toThrow(
        'Tipo debe ser "especialidad" o "practica"'
      )
    })

    it('debe lanzar error si servicio ya está agregado', async () => {
      const medicoId = '123'
      const servicioId = 'esp1'

      const medicoMock = {
        _id: medicoId,
        especialidades: [{ _id: servicioId }],
        practicas: [],
      }

      mockRepository.findById.mockResolvedValue(medicoMock)

      await expect(
        medicoService.agregarServicio(medicoId, servicioId, 'especialidad')
      ).rejects.toThrow('Este especialidad ya está asociado al médico')
    })

    it('debe lanzar error si médico no existe', async () => {
      mockRepository.findById.mockResolvedValue(null)

      await expect(medicoService.agregarServicio('123', 'serv456', 'especialidad')).rejects.toThrow(
        'Médico no encontrado'
      )
    })
  })

  describe('removerServicio', () => {
    it('debe remover una especialidad del médico', async () => {
      const medicoId = '123'
      const servicioId = 'esp1'

      const medicoMock = {
        _id: medicoId,
        especialidades: [{ _id: servicioId }, { _id: 'esp2' }],
        practicas: [],
        save: jest.fn().mockResolvedValue(true),
      }

      mockRepository.findById.mockResolvedValue(medicoMock)

      const resultado = await medicoService.removerServicio(medicoId, servicioId)

      expect(resultado.especialidades).toHaveLength(1)
      expect(resultado.especialidades[0]._id).toBe('esp2')
      expect(medicoMock.save).toHaveBeenCalled()
    })

    it('debe remover una práctica del médico', async () => {
      const medicoId = '123'
      const servicioId = 'prac1'

      const medicoMock = {
        _id: medicoId,
        especialidades: [],
        practicas: [{ _id: servicioId }],
        save: jest.fn().mockResolvedValue(true),
      }

      mockRepository.findById.mockResolvedValue(medicoMock)

      const resultado = await medicoService.removerServicio(medicoId, servicioId)

      expect(resultado.practicas).toHaveLength(0)
      expect(medicoMock.save).toHaveBeenCalled()
    })

    it('debe lanzar error si servicio no existe', async () => {
      const medicoMock = {
        _id: '123',
        especialidades: [],
        practicas: [],
      }

      mockRepository.findById.mockResolvedValue(medicoMock)

      await expect(medicoService.removerServicio('123', 'servicio_inexistente')).rejects.toThrow(
        'Servicio no encontrado en el médico'
      )
    })

    it('debe lanzar error si médico no existe', async () => {
      mockRepository.findById.mockResolvedValue(null)

      await expect(medicoService.removerServicio('123', 'serv456')).rejects.toThrow(
        'Médico no encontrado'
      )
    })
  })

  describe('obtenerDisponibilidad', () => {
    it('debe obtener disponibilidades del médico', async () => {
      const medicoId = '123'
      const medicoMock = {
        _id: medicoId,
        nombre: 'Dr. García',
        disponibilidades: [
          { diaSemana: 'lunes', horaDesde: '08:00', horaHasta: '12:00' },
          { diaSemana: 'miércoles', horaDesde: '14:00', horaHasta: '18:00' },
        ],
      }

      mockRepository.findById.mockResolvedValue(medicoMock)

      const resultado = await medicoService.obtenerDisponibilidad(medicoId)

      expect(resultado.disponibilidades).toHaveLength(2)
      expect(resultado.medico.nombre).toBe('Dr. García')
    })

    it('debe lanzar error si médico no existe', async () => {
      mockRepository.findById.mockResolvedValue(null)

      await expect(medicoService.obtenerDisponibilidad('123')).rejects.toThrow(
        'Médico no encontrado'
      )
    })
  })

  describe('obtenerHistorialPaciente', () => {
    it('debe obtener historial de paciente con estructura esperada', async () => {
      const medicoId = '123'
      const pacienteId = 'pac456'
      const medicoMock = {
        _id: medicoId,
        nombre: 'Dr. García',
      }

      mockRepository.findById.mockResolvedValue(medicoMock)

      const resultado = await medicoService.obtenerHistorialPaciente(medicoId, pacienteId)

      expect(resultado).toHaveProperty('paciente')
      expect(resultado).toHaveProperty('historial')
      expect(resultado).toHaveProperty('estadisticas')
      expect(resultado.paciente.id).toBe(pacienteId)
      expect(resultado.estadisticas).toEqual({
        totalTurnos: 0,
        realizados: 0,
        cancelados: 0,
      })
    })

    it('debe lanzar error si médico no existe', async () => {
      mockRepository.findById.mockResolvedValue(null)

      await expect(medicoService.obtenerHistorialPaciente('123', 'pac456')).rejects.toThrow(
        'Médico no encontrado'
      )
    })
  })

  describe('obtenerTodos', () => {
    it('debe retornar todos los médicos transformados a DTO', async () => {
      const medicosMock = [
        {
          _id: '1',
          usuario: 'drgarcia',
          matricula: 'MAT001',
          nombre: 'Dr. García',
          especialidades: [],
          practicas: [],
          sedes: [],
          disponibilidades: [],
        },
        {
          _id: '2',
          usuario: 'drlozano',
          matricula: 'MAT002',
          nombre: 'Dra. Lozano',
          especialidades: [],
          practicas: [],
          sedes: [],
          disponibilidades: [],
        },
      ]

      mockRepository.findAll.mockResolvedValue(medicosMock)

      const resultado = await medicoService.obtenerTodos()

      expect(resultado).toHaveLength(2)
      expect(resultado[0]).toHaveProperty('id')
      expect(resultado[0]).toHaveProperty('nombre')
      expect(mockRepository.findAll).toHaveBeenCalled()
    })
  })

  describe('obtenerPorId', () => {
    it('debe retornar médico por ID transformado a DTO', async () => {
      const medicoMock = {
        _id: '123',
        usuario: 'drgarcia',
        matricula: 'MAT001',
        nombre: 'Dr. García',
        especialidades: [],
        practicas: [],
        sedes: [],
        disponibilidades: [],
      }

      mockRepository.findById.mockResolvedValue(medicoMock)

      const resultado = await medicoService.obtenerPorId('123')

      expect(resultado.id).toBe('123')
      expect(resultado.nombre).toBe('Dr. García')
      expect(mockRepository.findById).toHaveBeenCalledWith('123')
    })

    it('debe retornar null si médico no existe', async () => {
      mockRepository.findById.mockResolvedValue(null)

      const resultado = await medicoService.obtenerPorId('123')

      expect(resultado).toBeNull()
    })
  })
})
