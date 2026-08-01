import app from './app.js'
import dotenv from 'dotenv'
import { MongoDBClient } from './config/database.js'
import { recordatorioTask } from './config/dependencies.js'
import { cargarDatosIniciales } from './config/seed.js'

dotenv.config()

const PORT = process.env.PUERTO || 3000

const start = async () => {
  try {
    await MongoDBClient.connect()
    // await cargarDatosIniciales()

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
