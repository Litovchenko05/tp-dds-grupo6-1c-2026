import swaggerAutogen from 'swagger-autogen'

const doc = {
  info: {
    title: 'Sistema Sweet Medical API',
    description: 'Documentación de la API del TP de Desarrollo de Software - 1C 2026',
    version: '1.0.0',
  },
  host: 'localhost:3000',
  schemes: ['http'],
}

const outputFile = '../docs/swaggerSpec.json'
const routesEndpointsFiles = ['../routes/router.js']

swaggerAutogen()(outputFile, routesEndpointsFiles, doc)
