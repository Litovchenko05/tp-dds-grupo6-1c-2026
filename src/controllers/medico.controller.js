import { MedicoService } from '../services/medico.service.js'
import { disponibilidadHorariaSchema} from '../schemas/disponibilidadHoraria.schema.js';

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
            const body = req.body;
            console.log(body);
            const resultado = disponibilidadHorariaSchema.safeParse(body);
            console.log("Resultado de validación:", resultado);

            if (!resultado.success) {
                console.log("el resultado dio error");
                return res.status(400).json({ status: 'error', message: resultado.error.errors })
            }
            console.log("no entre en el if");
            const disponibilidad = resultado.data;
            console.log(disponibilidad);
            const medicoId = req.params.id;
             console.log(medicoId);

         
            this.medicoService.agregarDisponibilidad(medicoId, disponibilidad);
            console.log("disponibilidad definida para el medico");

            return res.status(201).json({ status: 'success', data: disponibilidad })

        } catch (error) {
            return res.status(500).json({ data: error })            
        }
    }
}
