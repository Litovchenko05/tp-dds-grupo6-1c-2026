import express from 'express'
import router from './routes/router.js'
import { createRequire } from 'module'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'

const require = createRequire(import.meta.url)
const swaggerSpec = require('./docs/swaggerSpec.json')

const app = express()

const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(express.json())
app.use(
  cors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
)
app.use(router)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default app
