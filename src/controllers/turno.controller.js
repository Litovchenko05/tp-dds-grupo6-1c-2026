export class TurnoController {
  constructor({ turnoService }) {
    this.turnoService = turnoService
  }

  findAll = async (req, res) => {
    try {
      const resultado = this.turnoService.obtenerTodos()

      return res.status(200).json({
        status: 'success',
        data: resultado,
      })
    } catch (error) {
      return res.status(400).json({
        data: error,
      })
    }
  }

  findById = async (req, res) => {
    try {
      const { id } = req.params

      const turno = this.turnoService.obtenerPorId(id)

      if (!turno) {
        return res.status(404).json({ status: 'error', message: 'Turno no encontrado' })
      }

      return res.status(200).json({ status: 'success', data: turno })
    } catch (error) {
      return res.status(400).json({ data: error })
    }

    cancelarTurno = async (req, res) => {
        try {
            const { id } = req.params
            const { motivo, idUsuario } = req.body
            /* JSON que enviás desde el cliente:
            {
                "idUsuario": 5, //usuario que hace la cancelacion
                "motivo": "Me enfermé"
            }*/

            const resultado = this.turnoService.cancelarTurno({
                id, //del turno
                idUsuario,
                motivo
            })


            return res.status(200).json({
                status: 'success',
                data: resultado,
                message: 'Turno cancelado exitosamente'
            })

        } catch (error) {
            const status = error.message.includes('no encontrado') ? 404
                        : error.message.includes('anticipación') ? 400
                        : 500

            return res.status(status).json({
                status: 'error',
                message: error.message
            })
        }
    }
}

