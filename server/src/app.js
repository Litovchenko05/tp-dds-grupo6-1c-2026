import express from 'express'
import router from './routes/router.js'
import { createRequire } from 'module'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'

const require = createRequire(import.meta.url)
const swaggerSpec = require('./docs/swaggerSpec.json')

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)
app.use(router)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default app
