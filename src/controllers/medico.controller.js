import { especialidadSchema } from '../schemas/especialidad.schema.js'
import { medicoSchema } from '../schemas/medico.schema.js'
import { practicaSchema } from '../schemas/practica.schema.js'
import { PracticaSchema } from '../shemasBD/practicaSchema.js'

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
    modificarServicio = async (req, res) => {
    try {
      const body = req.body
      const resultado = practicaSchema.safeParse(body)

      if (!resultado.success) {
      resultado = especialidadSchema.safeParse(body);
        if(!resultado.success){
          console.log('el resultado dio error')
          return res.status(400).json({ status: 'error', message: resultado.error.errors })     
        }
    } 
    
      const medicoId = req.params.id
      const servicioId = req.params.idServicio
      await this.medicoService.modificarServicio(medicoId, servicioId, resultado.data)
      return res.status(200).json({ status: 'success', data: resultado.data })
    } catch (error) {
      return res.status(500).json({ data: error.message })
    }
  }
  createServicio = async(req,res)=>{
    try{
      const body = req.body
      let resultado = practicaSchema.safeParse(body);
      if (!resultado.success) {
      resultado = especialidadSchema.safeParse(body);
        if(!resultado.success){
          console.log('el resultado dio error')
          return res.status(400).json({ status: 'error', message: resultado.error.errors })     
        }
    } 
      const medicoId = req.params.id
      await this.medicoService.agregarServicio(medicoId, resultado.data)
      return res.status(201).json({ status: 'success', data: resultado.data })
    } 
    catch(error){
      return res.status(500).json({ data: error.message })
    }   

  }
  deleteServicio = async (req, res) => {
        try {
            const medicoId = req.params.id
            const tipoDeServicio = req.params.tipoServicio 
            const idServicio = req.params.servicioId
            await this.medicoService.eliminarServicio(idServicio,tipoDeServicio,medicoId)

            return res.status(200).json({ status: "success", data:"servicio eliminado" })
        } catch (error) {
            return this.manejarError(res, error)
        }
    }  
}
