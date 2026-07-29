export class ServicioController {
  constructor({ servicioService }) {
    this.servicioService = servicioService
  }

  findEspecialidades = async (req, res) => {
    try {
      const resultado = await this.servicioService.findAllEspecialidades()

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

  findPracticas = async (req, res) => {
    try {
      const resultado = await this.servicioService.findAllPracticas()

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
}
