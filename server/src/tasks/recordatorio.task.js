import cron from 'node-cron'
import { formatearFechaHora } from '../config/utils.js'

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
          const { _, hora } = formatearFechaHora(turno.fechaHora)
          loteData.push({
            destinatarioId: turno.paciente.usuario,
            mensaje: `Recordatorio: Mañana tenés un turno con el Dr. ${turno.medico.nombre} a las ${hora} hs para la ${turno.tipoDeServicio}: ${turno.servicio.nombre} en ${turno.sede.nombre} - ${turno.sede.direccion}.`,
          })

          loteData.push({
            destinatarioId: turno.medico.usuario,
            mensaje: `Recordatorio: Mañana tenés un turno agendado a las ${hora} hs en ${turno.sede.nombre}.`,
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
