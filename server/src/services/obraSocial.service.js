export class ObraSocialService {
  constructor({ obraSocialRepository }) {
    this.obraSocialRepository = obraSocialRepository
  }

  async findAll() {
    const obrasSociales = await this.obraSocialRepository.findAll()

    return obrasSociales
  }
}
