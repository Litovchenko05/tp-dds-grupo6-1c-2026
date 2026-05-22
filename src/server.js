import app from './app.js'
import { cargarDatosDePruebaEnMemoria } from './repositories/datosPrueba.enMemoria.js'

const PORT = 3000

cargarDatosDePruebaEnMemoria()

app.listen(PORT, () => {
  console.log('--- Sistema Sweet Medical ---')
  console.log(`Servidor escuchando en: http://localhost:${PORT}`)
})
