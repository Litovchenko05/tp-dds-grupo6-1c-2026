import app from './app.js'
import dotenv from 'dotenv'
// import { cargarDatosDePruebaEnMemoria } from './repositories/datosPrueba.enMemoria.js'
import { MongoDBClient } from './config/database.js'

dotenv.config()

const PORT = process.env.PUERTO || 3000

// cargarDatosDePruebaEnMemoria()

const start = async () => {
    try{
        //conectar con mongoDB
        await MongoDBClient.connect()

        app.listen(PORT, () => {
        console.log('--- Sistema Sweet Medical ---')
        console.log(`Servidor escuchando en: http://localhost:${PORT}`)
})
      
    }
    catch(error){
        console.error(error);
    }
}

start()
