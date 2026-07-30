export class SedeService {
  constructor({ sedeRepository }) {
    this.sedeRepository = sedeRepository
  }

  async findAll() {
    const sedes = await this.sedeRepository.findAll()

    return sedes
  }
}
