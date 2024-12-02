const tiendaModel = require('../modelos/tiendaModels');

const getTiendas = async (req, res) => {
    const tiendas = await tiendaModel.find();
    res.json(tiendas);
}

module.exports = { getTiendas }