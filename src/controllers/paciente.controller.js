export class PacienteController {
  constructor({ pacienteService }) {
    this.pacienteService = pacienteService
  }

  reservarTurno = async (req, res) => {
    try {
      const pacienteId = req.params.pacienteId
      const turnoId = req.params.turnoId

      await this.pacienteService.reservarTurno(pacienteId, turnoId)

      return res.status(200).json({ status: 'success', message: 'Turno reservado exitosamente' })
    } catch (error) {
      return res.status(500).json({ data: error.message })
    }
  }

  consultarHistorial = async (req, res) => {
    try {
      const pacienteId = req.params.pacienteId
      const historial = await this.pacienteService.consultarHistorial(pacienteId)
      return res.status(200).json({ status: 'success', data: historial })
    } catch (error) {
      return res.status(500).json({ data: error.message })
    }
  }

  solicitarCambioDeFecha = async (req, res) => {
    try {
      const pacienteId = req.params.pacienteId
      const turnoId = req.params.turnoId
      const nuevaFecha = req.body.nuevaFecha

      this.pacienteService.solicitarCambioDeFecha(pacienteId, turnoId, nuevaFecha)

      return res.status(200).json({
        status: 'success',
        message: 'Solicitud de cambio de fecha enviada exitosamente, espera la confirmación',
      })
    } catch (error) {
      return res.status(500).json({ data: error.message })
    }
  }
}
