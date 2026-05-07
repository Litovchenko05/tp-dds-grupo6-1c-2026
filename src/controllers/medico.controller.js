import { MedicoService } from '../services/medico.service.js'

export class MedicoController {
    constructor({ medicoService }) {
        this.medicoService = medicoService
    }

    findAll = async (req, res) => {
        try {
            const resultado = this.medicoService.obtenerTodos()

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

            const medico = this.medicoService.obtenerPorId(id)

            if (!medico) {
                return res.status(404).json({ status: 'error', message: 'Medico no encontrado' })
            }

            return res.status(200).json({ status: 'success', data: medico })
        } catch (error) {
            return res.status(400).json({ data: error })
        }
    }

    createDisponibilidad = async (req, res) => {
        try {
            // TODO

        } catch (error) {
            return res.status(400).json({ data: error })            
        }
    }
}
