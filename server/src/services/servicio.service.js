export class ServicioService {
  constructor({ servicioRepository }) {
    this.servicioRepository = servicioRepository
  }

  async findAllEspecialidades() {
    const especialidades = await this.servicioRepository.findByFilters({
      tipo: 'especialidad',
    })
    return especialidades
  }

  async findAllPracticas() {
    const practicas = await this.servicioRepository.findByFilters({
      tipo: 'practica',
    })
    return practicas
  }
}
