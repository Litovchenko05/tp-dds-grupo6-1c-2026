import app from './app.js'

const PORT = 3000

app.listen(PORT, () => {
    console.log('--- Sistema Sweet Medical ---');
    console.log(`Servidor escuchando en: http://localhost:${PORT}`);
})

