export class PlanController {
  constructor({ planService }) {
    this.planService = planService
  }

  findAll = async (req, res) => {
    try {
      const resultado = await this.planService.findAll()

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
