export class SedeController {
  constructor({ sedeService }) {
    this.sedeService = sedeService
  }

  findAll = async (req, res) => {
    try {
      const resultado = await this.sedeService.findAll()

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
