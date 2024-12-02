const express = require('express');
const router = express.Router();
const usuarioControllers = require('../controllers/usuarioControllers');
const { use } = require('../app');

router.get('/', usuarioControllers.getTiendas);

module.exports = router;