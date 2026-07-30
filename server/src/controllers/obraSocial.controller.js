export class ObraSocialController {
  constructor({ obraSocialService }) {
    this.obraSocialService = obraSocialService
  }

  findAll = async (req, res) => {
    try {
      const resultado = await this.obraSocialService.findAll()

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
