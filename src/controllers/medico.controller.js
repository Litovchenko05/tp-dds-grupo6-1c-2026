import { medicoSchema } from '../schemas/medico.schema.js'

export class MedicoController {

  constructor({ medicoService }) {
    this.medicoService = medicoService
  }

  createMedico = async (req, res) => {
    try{
      const body = req.body
     
      const resultado = medicoSchema.safeParse(body)

      if (!resultado.success) {
        console.log('el resultado dio error')
        return res.status(400).json({ status: 'error', message: resultado.error.message })
      }

      const medicoCreado = await this.medicoService.createMedico(resultado.data)

      return res.status(201).json({ status: 'success', data: medicoCreado })

    }catch(error){
      return res.status(409).json({ data: error.message })
    }
  }

  findAll = async (req, res) => {
    try {
      const resultado = await this.medicoService.obtenerTodos()

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
      const body = req.body
      const resultado = disponibilidadHorariaSchema.safeParse(body)

      if (!resultado.success) {
        console.log('el resultado dio error')
        return res.status(400).json({ status: 'error', message: resultado.error.errors })
      }

      const medicoId = req.params.id

      await this.medicoService.agregarDisponibilidad(medicoId, resultado.data)

      return res.status(201).json({ status: 'success', data: resultado.data })
    } catch (error) {
      return res.status(500).json({ data: error.message })
    }
  }

  modificarDisponibilidad = async (req, res) => {
    try {
      const body = req.body
      const resultado = disponibilidadHorariaSchema.safeParse(body)

      if (!resultado.success) {
        console.log('el resultado dio error')
        return res.status(400).json({ status: 'error', message: resultado.error.errors })
      }

      const medicoId = req.params.id
      const disponibilidadId = req.params.idDisponibilidad
      await this.medicoService.modificarDisponibilidad(medicoId, disponibilidadId, resultado.data)
      return res.status(200).json({ status: 'success', data: resultado.data })
    } catch (error) {
      return res.status(500).json({ data: error.message })
    }
  }

  
  obtenerDisponibilidades = async (req, res) => {
  try {
    const { id } = req.params

    const { tipoServicio } = req.query

    const disponibilidades = this.medicoService.obtenerDisponibilidadesPorTipoServicio(
      id,
      tipoServicio
    )

    return res.status(200).json({
      status: 'success',
      data: disponibilidades,
    })
  } catch (error) {
    if (error.message === 'Médico no encontrado') {
      return res.status(404).json({
        status: 'error',
        message: error.message,
      })
    }

    if (error.message === 'El médico no atiende el servicio solicitado') {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    }

    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
    })
  }
}

}
