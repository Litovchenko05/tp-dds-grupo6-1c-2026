import 'dotenv/config'
import mongoose from 'mongoose'
import { TurnoModel } from '../schemasBD/turnoSchema.js'

const estados = ['DISPONIBLE', 'RESERVADO', 'CONFIRMADO', 'CANCELADO', 'REALIZADO']

async function normalizarEstadosTurno() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
  if (!mongoUri) throw new Error('Definí MONGO_URI o MONGODB_URI antes de ejecutar la migración.')

  await mongoose.connect(mongoUri)
  const resultado = await TurnoModel.updateMany(
    { estado: { $in: estados.map((estado) => estado.toLowerCase()) } },
    [{ $set: { estado: { $toUpper: '$estado' } } }]
  )
  console.log(`Turnos normalizados: ${resultado.modifiedCount}`)
  await mongoose.disconnect()
}

normalizarEstadosTurno().catch(async (error) => {
  console.error(error.message)
  await mongoose.disconnect()
  process.exitCode = 1
})
