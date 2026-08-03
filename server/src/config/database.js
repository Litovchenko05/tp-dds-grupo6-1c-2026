import mongoose from 'mongoose'

export class MongoDBClient {
  static async connect() {
    try {
      const rawUri = process.env.MONGODB_URI
      const dbName = process.env.MONGODB_DB_NAME

      if (!rawUri) {
        throw new Error('MONGODB_URI no está definida en variables de entorno')
      }

      const hasScheme = rawUri.startsWith('mongodb://') || rawUri.startsWith('mongodb+srv://')
      if (!hasScheme) {
        throw new Error('MONGODB_URI debe comenzar con mongodb:// o mongodb+srv://')
      }

      const connectionUri =
        dbName && !rawUri.includes(`/${dbName}`) ? `${rawUri.replace(/\/$/, '')}/${dbName}` : rawUri

      const conn = await mongoose.connect(connectionUri)
      console.log(`MongoDB is connected: ${conn.connection.host}`)
    } catch (error) {
      console.error(`Error: ${error.message}`)
      process.exit(1)
    }
  }
}
