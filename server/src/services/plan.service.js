export class PlanService {
  constructor({ planRepository }) {
    this.planRepository = planRepository
  }

  async findAll() {
    const planes = await this.planRepository.findAll()

    return planes
  }
}
