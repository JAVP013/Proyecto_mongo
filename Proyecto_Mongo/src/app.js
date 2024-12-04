const express = require('express');
const bodyParser = require('body-parser');

const tiendaRutas = require('./routas/tiendaRutas');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/tiendas', tiendaRutas);

app.get('/', (req, res) => {
    res.send('hola mundo'); 
})

app.use((req, res, next) => {
    res.status(404).json({
        code: 404,
        message: 'ruta no encontrada'
    })
})

module.exports = app;