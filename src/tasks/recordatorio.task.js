import cron from 'node-cron'

export class RecordatorioTask {
  constructor({ turnoRepository, notificacionService }) {
    this.turnoRepository = turnoRepository
    this.notificacionService = notificacionService
  }

  iniciar() {
    try {
      cron.schedule('0 8 * * *', async () => {
        console.log('Ejecutando tarea automática de recordatorios de turnos...')

        const turnosDeManiana = await this.turnoRepository.obtenerTurnosParaManiana()
        const loteData = []

        for (const turno of turnosDeManiana) {
          loteData.push({
            destinatarioId: turno.pacienteId,
            remitenteId: 'SISTEMA_ID',
            mensaje: `Recordatorio: Mañana tenés un turno con el Dr. ${turno.medico.nombre} a las ${turno.hora} hs.`,
          })

          loteData.push({
            destinatarioId: turno.medicoId,
            remitenteId: 'SISTEMA_ID',
            mensaje: `Recordatorio: Mañana tenés un turno agendado a las ${turno.hora} hs.`,
          })
        }
        if (loteData.length > 0) {
          await this.notificacionService.crearNotificacionesEnLote(loteData)
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  }
}
