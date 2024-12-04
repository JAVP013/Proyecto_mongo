const express = require('express');
const router = express.Router();
const tiendaControllers = require('../controllers/tiendaControllers');
const { use } = require('../app');
const cache = require('../cache/cache');

router.get('/tiendas/:tiendaId/usuarios', tiendaControllers.getUsuarios);


//Q1. Listar los productos de una categoría específica.
router.get('/productos/categoria/:categoria', cache,tiendaControllers.getProductosPorCategoria);


//Q2. Listar los productos de una marca específica.
router.get('/productos/marca/:marca', cache,tiendaControllers.getProductosPorMarca);


//Q3. Listar los productos de una marca específica y los clientes que los han agregado a su carrito.
router.get('/productos/marca/:marca/clientes', cache,    tiendaControllers.getProductosYClientesPorMarca);

//Q4. Listar los productos que ha agregado un cliente en específico a su carrito de compras.
router.get('/productos/cliente/:nombreCliente', cache,tiendaControllers.getProductosCarritoCliente);


//Q5. Listar los comentarios de un producto con una valoración específica.
router.get('/comentarios/valoracion', cache, tiendaControllers.getComentariosPorValoracion);



//Q6.  Listar los productos más agregados a los carritos de compra.
router.get('/productos/mas-agregados', cache, tiendaControllers.getProductosMasAgregados);




//Q7.  Listar todos los pedidos (incluyendo los productos) de un cliente en específico.
router.get('/pedidos/usuario/:id', cache,tiendaControllers.getPedidosPorUsuario);


//Q8. Listar todos los productos que ha adquirido un cliente en específico.
router.get('/productos/pedido/usuario/:id', cache, tiendaControllers.getProductosDePedidoPorUsuario);


//Q9  Listar todos los Clientes que han comprado un producto en específico.
router.get('/productos-en-carrito/:productoId', cache, tiendaControllers.getProductosEnCarritoPorUsuario);

module.exports = router;
