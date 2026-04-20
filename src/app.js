import express from 'express'

const app = express()
app.use(express.json())

app.get('/healthcheck', (req, res) => { 
    res.status(200).json({
        system: 'Sweet Medical - Plataforma de Seguro de la Salud', 
        status: 'available', 
        version: '1.0.0', 
        timestamp: new Date().toISOString(), 
        uptime: process.uptime() 
    }); 
});



export default app