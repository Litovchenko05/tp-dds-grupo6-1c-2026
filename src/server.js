import app from './app.js'
import dotenv from 'dotenv'
import { MongoDBClient } from './config/database.js'
import { TurnoRepository } from './repositories/turno.repository.js'
import { NotificacionRepository } from './repositories/notificacion.repository.js'
import { NotificacionService } from './services/notificacion.service.js'
import { RecordatorioTask } from './tasks/recordatorio.task.js'

dotenv.config()

const PORT = process.env.PUERTO || 3000

const start = async () => {
  try {
    await MongoDBClient.connect()

    const turnoRepository = new TurnoRepository()
    const notificacionRepository = new NotificacionRepository()
    const notificacionService = new NotificacionService({ notificacionRepository })

    const recordatorioTask = new RecordatorioTask({
      turnoRepository,
      notificacionService,
    })

    recordatorioTask.iniciar()

    app.listen(PORT, () => {
      console.log('--- Sistema Sweet Medical ---')
      console.log(`Servidor escuchando en: http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error(error)
  }
}

start()
