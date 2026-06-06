import { TurnoService } from '../turno.service.js'
import { EstadoTurno } from '../../models/estadoTurno.enum.js'

// Mock del TurnoRepository
jest.mock('../../repositories/turno.repository.js', () => {
  return {
    TurnoRepository: jest.fn().mockImplementation(() => ({
      findById: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      buscarTurnosPaginated: jest.fn(),
    })),
  }
})

describe('TurnoService', () => {
  let turnoService
  let mockRepository

  beforeEach(() => {
    turnoService = new TurnoService()
    mockRepository = turnoService.turnoRepository
    jest.clearAllMocks()
  })

  describe('cancelarTurno', () => {
    it('debe cancelar un turno válido', async () => {
      const turnoId = '123'
      const medicoId = 'doc456'
      const motivo = 'Emergencia personal'

      const turnoMock = {
        _id: turnoId,
        medico: { _id: medicoId },
        estado: EstadoTurno.DISPONIBLE,
        fechaHora: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas en el futuro
      }

      const turnoActualizadoMock = {
        ...turnoMock,
        estado: EstadoTurno.CANCELADO,
        historialEstados: [
          {
            fechaHoraIngreso: expect.any(Date),
            estado: EstadoTurno.CANCELADO,
            usuario: medicoId,
            motivo,
          },
        ],
      }

      mockRepository.findById.mockResolvedValue(turnoMock)
      mockRepository.update.mockResolvedValue(turnoActualizadoMock)

      const resultado = await turnoService.cancelarTurno(turnoId, medicoId, motivo)

      expect(resultado.estado).toBe(EstadoTurno.CANCELADO)
      expect(mockRepository.findById).toHaveBeenCalledWith(turnoId)
      expect(mockRepository.update).toHaveBeenCalled()
    })

    it('debe lanzar error si turno no existe', async () => {
      mockRepository.findById.mockResolvedValue(null)

      await expect(turnoService.cancelarTurno('123', 'doc456', 'Test')).rejects.toThrow(
        'Turno no encontrado'
      )
    })

    it('debe lanzar error si el médico no pertenece al turno', async () => {
      const turnoMock = {
        _id: '123',
        medico: { _id: 'otroMedico' },
        estado: EstadoTurno.DISPONIBLE,
      }

      mockRepository.findById.mockResolvedValue(turnoMock)

      await expect(turnoService.cancelarTurno('123', 'medicoIncorrecto', 'Test')).rejects.toThrow(
        'Este turno no pertenece al médico'
      )
    })

    it('debe lanzar error si turno ya está cancelado', async () => {
      const turnoMock = {
        _id: '123',
        medico: { _id: 'doc456' },
        estado: EstadoTurno.CANCELADO,
      }

      mockRepository.findById.mockResolvedValue(turnoMock)

      await expect(turnoService.cancelarTurno('123', 'doc456', 'Test')).rejects.toThrow(
        'El turno ya está cancelado'
      )
    })

    it('debe lanzar error si intenta cancelar turno en estado no permitido', async () => {
      const turnoMock = {
        _id: '123',
        medico: { _id: 'doc456' },
        estado: EstadoTurno.REALIZADO,
      }

      mockRepository.findById.mockResolvedValue(turnoMock)

      await expect(turnoService.cancelarTurno('123', 'doc456', 'Test')).rejects.toThrow(
        `No se puede cancelar un turno en estado ${EstadoTurno.REALIZADO}`
      )
    })
  })

  describe('marcarRealizadoTurno', () => {
    it('debe marcar un turno como realizado correctamente', async () => {
      const turnoId = '123'
      const medicoId = 'doc456'
      const notas = 'Turno completado sin complicaciones'

      const turnoMock = {
        _id: turnoId,
        medico: { _id: medicoId },
        estado: EstadoTurno.RESERVADO,
      }

      const turnoActualizadoMock = {
        ...turnoMock,
        estado: EstadoTurno.REALIZADO,
        historialEstados: [
          {
            fechaHoraIngreso: expect.any(Date),
            estado: EstadoTurno.REALIZADO,
            usuario: medicoId,
            motivo: notas,
          },
        ],
      }

      mockRepository.findById.mockResolvedValue(turnoMock)
      mockRepository.update.mockResolvedValue(turnoActualizadoMock)

      const resultado = await turnoService.marcarRealizadoTurno(turnoId, medicoId, notas)

      expect(resultado.estado).toBe(EstadoTurno.REALIZADO)
      expect(mockRepository.update).toHaveBeenCalled()
    })

    it('debe lanzar error si turno no existe', async () => {
      mockRepository.findById.mockResolvedValue(null)

      await expect(turnoService.marcarRealizadoTurno('123', 'doc456')).rejects.toThrow(
        'Turno no encontrado'
      )
    })

    it('debe lanzar error si el médico no pertenece al turno', async () => {
      const turnoMock = {
        _id: '123',
        medico: { _id: 'otroMedico' },
        estado: EstadoTurno.RESERVADO,
      }

      mockRepository.findById.mockResolvedValue(turnoMock)

      await expect(turnoService.marcarRealizadoTurno('123', 'medicoIncorrecto')).rejects.toThrow(
        'Este turno no pertenece al médico'
      )
    })

    it('debe lanzar error si turno no está en estado RESERVADO', async () => {
      const turnoMock = {
        _id: '123',
        medico: { _id: 'doc456' },
        estado: EstadoTurno.DISPONIBLE,
      }

      mockRepository.findById.mockResolvedValue(turnoMock)

      await expect(turnoService.marcarRealizadoTurno('123', 'doc456')).rejects.toThrow(
        `No se puede marcar como realizado un turno en estado ${EstadoTurno.DISPONIBLE}`
      )
    })
  })

  describe('proponerCambioFecha', () => {
    it('debe proponer cambio de fecha para turno reservado', async () => {
      const turnoId = '123'
      const medicoId = 'doc456'
      const nuevaFecha = '2026-06-10'
      const nuevaHora = '14:30'

      const turnoMock = {
        _id: turnoId,
        medico: { _id: medicoId },
        estado: EstadoTurno.RESERVADO,
        fechaHora: new Date('2026-06-05T10:00:00'),
      }

      const turnoActualizadoMock = {
        ...turnoMock,
        historialEstados: [
          {
            fechaHoraIngreso: expect.any(Date),
            estado: 'CAMBIO_PROPUESTO',
            usuario: medicoId,
            motivo: 'Cambio de fecha propuesto por médico',
            fechaProuesta: nuevaFecha,
            horaProuesta: nuevaHora,
            original: {
              fecha: turnoMock.fechaHora,
            },
          },
        ],
      }

      mockRepository.findById.mockResolvedValue(turnoMock)
      mockRepository.update.mockResolvedValue(turnoActualizadoMock)

      const resultado = await turnoService.proponerCambioFecha(
        turnoId,
        medicoId,
        nuevaFecha,
        nuevaHora
      )

      expect(mockRepository.update).toHaveBeenCalled()
      expect(resultado.historialEstados[0].estado).toBe('CAMBIO_PROPUESTO')
    })

    it('debe lanzar error si turno no existe', async () => {
      mockRepository.findById.mockResolvedValue(null)

      await expect(
        turnoService.proponerCambioFecha('123', 'doc456', '2026-06-10', '14:30')
      ).rejects.toThrow('Turno no encontrado')
    })

    it('debe lanzar error si turno no está en estado RESERVADO', async () => {
      const turnoMock = {
        _id: '123',
        medico: { _id: 'doc456' },
        estado: EstadoTurno.DISPONIBLE,
      }

      mockRepository.findById.mockResolvedValue(turnoMock)

      await expect(
        turnoService.proponerCambioFecha('123', 'doc456', '2026-06-10', '14:30')
      ).rejects.toThrow('Solo se puede proponer cambio de fecha para turnos reservados')
    })
  })

  describe('obtenerTodos', () => {
    it('debe retornar todos los turnos', async () => {
      const turnosMock = [
        { _id: '1', estado: EstadoTurno.DISPONIBLE },
        { _id: '2', estado: EstadoTurno.RESERVADO },
      ]

      mockRepository.findAll.mockResolvedValue(turnosMock)

      const resultado = await turnoService.obtenerTodos()

      expect(resultado).toHaveLength(2)
      expect(mockRepository.findAll).toHaveBeenCalled()
    })
  })

  describe('obtenerPorId', () => {
    it('debe retornar un turno por ID', async () => {
      const turnoMock = { _id: '123', estado: EstadoTurno.DISPONIBLE }

      mockRepository.findById.mockResolvedValue(turnoMock)

      const resultado = await turnoService.obtenerPorId('123')

      expect(resultado).toEqual(turnoMock)
      expect(mockRepository.findById).toHaveBeenCalledWith('123')
    })
  })

  describe('buscarTurnos', () => {
    it('debe buscar turnos con paginación y ordenamiento', async () => {
      const turnosMock = [
        { _id: '1', estado: EstadoTurno.DISPONIBLE, fechaHora: new Date('2026-06-05') },
        { _id: '2', estado: EstadoTurno.DISPONIBLE, fechaHora: new Date('2026-06-06') },
      ]

      const resultadoMock = {
        turnos: turnosMock,
        total: 2,
        page: 1,
        limit: 5,
        totalPages: 1,
      }

      mockRepository.buscarTurnosPaginated.mockResolvedValue(resultadoMock)

      const resultado = await turnoService.buscarTurnos({
        nombreMedico: 'Dr. Garcia',
        page: 1,
        limit: 5,
      })

      expect(resultado.data).toHaveLength(2)
      expect(resultado.pagination.total).toBe(2)
      expect(resultado.pagination.totalPages).toBe(1)
      expect(mockRepository.buscarTurnosPaginated).toHaveBeenCalled()
    })

    it('debe incluir información de cobertura en respuesta', async () => {
      const turnosMock = [{ _id: '1', estado: EstadoTurno.DISPONIBLE }]

      const resultadoMock = {
        turnos: turnosMock,
        total: 1,
        page: 1,
        limit: 5,
        totalPages: 1,
      }

      mockRepository.buscarTurnosPaginated.mockResolvedValue(resultadoMock)

      const resultado = await turnoService.buscarTurnos({})

      expect(resultado.data[0]).toHaveProperty('cobertura')
      expect(resultado.data[0].cobertura).toEqual({
        estado: 'PENDIENTE_CALCULO',
        montoAbonarPaciente: null,
        porcentajeCobertura: null,
        esUrgencia: false,
      })
    })

    it('debe respetar parámetros de ordenamiento', async () => {
      mockRepository.buscarTurnosPaginated.mockResolvedValue({
        turnos: [],
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 0,
      })

      await turnoService.buscarTurnos({
        sortBy: 'costo',
        order: 'desc',
      })

      expect(mockRepository.buscarTurnosPaginated).toHaveBeenCalledWith(
        expect.objectContaining({
          sortBy: 'costo',
          order: 'desc',
        })
      )
    })
  })
})
