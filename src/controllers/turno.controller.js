import { TurnoService } from '../services/turno.service.js'

export class TurnoController {
    constructor({ turnoService }) {
        this.turnoService = turnoService
    }

    findAll = async (req, res) => {
        try {
            const resultado = this.turnoService.obtenerTodos()

            return res.status(200).json({
                status: 'success',
                data: resultado
            })
        } catch (error) {
            return res.status(400).json({
                data: error
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
    }
}