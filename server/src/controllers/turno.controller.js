export class TurnoController {
  constructor({ turnoService }) {
    this.turnoService = turnoService
  }

  turnosReservados = async (req, res) => {
    try {
      const { idUsuario } = req.params
      const resultado = await this.turnoService.obtenerTurnosReservados(idUsuario)

      return res.status(200).json({
        status: 'success',
        data: resultado,
      })
    } catch (error) {
      return res.status(400).json({
        data: error.message,
      })
    }
  }
  findAll = async (req, res) => {
    try {
      const resultado = await this.turnoService.obtenerTodos()

      return res.status(200).json({
        status: 'success',
        data: resultado,
      })
    } catch (error) {
      return res.status(400).json({
        data: error.message,
      })
    }
  }

  findById = async (req, res) => {
    try {
      const id = req.params.id

      const turno = await this.turnoService.obtenerPorId(id)

      if (!turno) {
        return res.status(404).json({ status: 'error', message: 'Turno no encontrado' })
      }

      return res.status(200).json({ status: 'success', data: turno })
    } catch (error) {
      return res.status(400).json({ data: error.message })
    }
  }

  cancelarTurno = async (req, res) => {
    console.log('llegue al controller')
    try {
      const { idTurno } = req.params

      const { motivo, idUsuario } = req.body
      console.log('idTurno:', idTurno)
      console.log('idUsuario:', idUsuario)
      console.log('motivo:', motivo)
      const resultado = await this.turnoService.cancelar(idTurno, idUsuario, motivo)

      return res.status(200).json({
        status: 'success',
        data: resultado,
        message: 'Turno cancelado exitosamente',
      })
    } catch (error) {
      const status = error.message.includes('no encontrado')
        ? 404
        : error.message.includes('anticipación')
          ? 400
          : 500

      return res.status(status).json({
        status: 'error',
        message: error.message,
      })
    }
  }

  marcarTurnoComoRealizado = async (req, res) => {
    try {
      const { id } = req.params
      const resultado = this.turnoService.marcarTurnoComoRealizado(id)

      return res.status(200).json({
        status: 'success',
        data: resultado,
        message: 'Turno marcado como realizado exitosamente',
      })
    } catch (error) {
      const status = error.message.includes('no encontrado')
        ? 404
        : error.message.includes('no tiene permiso')
          ? 403
          : error.message.includes('solo se pueden marcar como realizado un turno confirmado')
            ? 409
            : 500

      return res.status(status).json({
        status: 'error',
        message: error.message,
      })
    }
  }

  //GET ALL PAGINADO
  async findAllPaginated(req, res) {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 5
      const idUsuario = req.query.idUsuario || null
      const sortBy = req.query.sortBy || 'fechaHora'
      const order = req.query.order || 'asc'

      const resultado = await this.turnoService.findAllPaginated(
        idUsuario,
        page,
        limit,
        sortBy,
        order
      )
      return res.status(200).json({
        status: 'success',
        data: resultado,
      })
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    }
  }

  //obtener turnos filtrados y paginados
  async findAllFilteredPaginated(req, res) {
    try {
      const {
        idUsuario,
        nombreMedico,
        idServicio,
        idSede,
        fechaDesde,
        fechaHasta,
        tipoServicio,
        page,
        limit,
        sortBy,
        order,
      } = req.query

      const resultado = await this.turnoService.findAllFilteredPaginated({
        idUsuario,
        nombreMedico,
        idServicio,
        idSede,
        fechaDesde,
        fechaHasta,
        tipoServicio,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        sortBy,
        order,
      })

      return res.status(200).json({
        status: 'success',
        data: resultado,
      })
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    }
  }

  findTurnosByProfesional = async (req, res) => {
    try {
      const nombreDeProfesional = req.query.profesional
      if (!nombreDeProfesional) {
        const turnos = await this.turnoService.obtenerTodos()

        return res.status(200).json({ status: 'succes', data: turnos })
      }
      const turnosFiltradosPorProfesional =
        await this.turnoService.obtenerTurnosPorProfesional(nombreDeProfesional)

      return res.status(200).json({ status: 'success', data: turnosFiltradosPorProfesional })
    } catch (error) {
      return res.status(400).json({ data: error.message })
    }
  }

  findTurnosByEspecialidad = async (req, res) => {
    try {
      const nombreDeEspecialidad = req.query.especialidad
      if (!nombreDeEspecialidad) {
        const turnos = await this.turnoService.obtenerTodos()
        return res.status(200).json({ status: 'succes', data: turnos })
      }

      const turnosFiltradosEspecialidad =
        await this.turnoService.obtenerTurnosPorEspecialidad(nombreDeEspecialidad)
      return res.status(200).json({ status: 'success', data: turnosFiltradosEspecialidad })
    } catch (error) {
      return res.status(400).json({ data: error.message })
    }
  }

  findTurnosByPractica = async (req, res) => {
    try {
      const nombreDePractica = req.query.practica
      if (!nombreDePractica) {
        const turnos = await this.turnoService.obtenerTodos()
        return res.status(200).json({ status: 'succes', data: turnos })
      }

      const turnosFiltradosPractica =
        await this.turnoService.obtenerTurnosPorPractica(nombreDePractica)
      return res.status(200).json({ status: 'success', data: turnosFiltradosPractica })
    } catch (error) {
      return res.status(400).json({ data: error.message })
    }
  }

  findTurnosBySede = async (req, res) => {
    try {
      const nombreDeSede = req.query.sede
      if (!nombreDeSede) {
        const turnos = await this.turnoService.obtenerTodos()
        return res.status(200).json({ status: 'succes', data: turnos })
      }

      const turnosFiltradosSede = await this.turnoService.obtenerTurnosPorSede(nombreDeSede)
      return res.status(200).json({ status: 'success', data: turnosFiltradosSede })
    } catch (error) {
      return res.status(400).json({ data: error.message })
    }
  }

  findTurnosByRangoDeFechas = async (req, res) => {
    try {
      const fechaIncial = req.query.LI
      const fechaFinal = req.query.FF

      if (!fechaIncial || !fechaFinal) {
        const turnos = await this.turnoService.obtenerTodos()
        return res.status(200).json({ status: 'succes', data: turnos })
      }
      const turnosFiltradosRango = await this.turnoService.obtenerTurnosPorRango(
        fechaIncial,
        fechaFinal
      )
      return res.status(200).json({ status: 'success', data: turnosFiltradosRango })
    } catch (error) {
      return res.status(400).json({ data: error.message })
    }
  }
}
