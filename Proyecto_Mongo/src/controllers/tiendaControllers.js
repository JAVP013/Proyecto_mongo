const tiendaModel = require('../modelos/tiendaModels');

async function getUsuarios(req, res) {
    try {
        const { tiendaId } = req.params; // El ID de la tienda se pasa como parámetro

        // Buscar la tienda por ID y obtener solo los usuarios
        const tienda = await tiendaModel.findById(tiendaId, 'usuarios');

        if (!tienda) {
            return res.status(404).json({ success: false, message: "Tienda no encontrada" });
        }

        // Extraer solo los datos que necesitamos (nombre, email, etc.) y excluir el carrito
        const usuarios = tienda.usuarios.map((usuario) => ({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            direccion_envio: usuario.direccion_envio,
            telefono: usuario.telefono,
        }));

        res.status(200).json({ success: true, data: usuarios });
    } catch (error) {
        if (error.name === 'CastError') {
            // Si el error es de tipo CastError, significa que el ID no es válido
            return res.status(404).json({ success: false, message: "Usuarios no encontrados" });
        }
        // Cualquier otro error se maneja normalmente
        return res.status(400).json({ success: false, message: error.message });
    }
}








// Q1. Listar los productos de una categoría específica.
const getProductosPorCategoria = async (req, res) => {
    try {
        const { categoria } = req.params; // La categoría se pasa como parámetro en la URL

        // Ejecutar la consulta de agregación
        const productos = await tiendaModel.aggregate([
            {
                $unwind: "$productos", // Descompone el arreglo de productos
            },
            {
                $match: { "productos.categoria": categoria }, // Filtra por categoría
            },
            {
                $project: {
                    _id: 0, // Excluye el campo _id
                    categoria: "$productos.categoria",
                    nombre_producto: "$productos.descripcion",
                    precio: "$productos.precio",
                },
            },
        ]);

        // Si no se encuentran productos, devolver un mensaje adecuado
        if (productos.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron productos para esta categoría.",
            });
        }

        // Devolver los productos encontrados
        res.status(200).json({
            message: "Q1. Listar los productos de una categoría específica.",
            success: true,
            data: productos,
        });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({
            success: false,
            message: "Error al obtener los productos por categoría.",
            error: error.message,
        });
    }
};
//---------------------------------------------------------------------------------






//Q2. Listar los productos de una marca spécifica.
const getProductosPorMarca = async (req, res) => {
    try {
        const { marca } = req.params; // La marca se pasa como parámetro en la URL

        // Ejecutar la consulta de agregación
        const productos = await tiendaModel.aggregate([
            {
                $unwind: "$productos", // Descompone el arreglo de productos
            },
            {
                $match: { "productos.marca": marca }, // Filtra por marca
            },
            {
                $project: {
                    _id: 0, // Excluye el campo _id
                    marca: "$productos.marca",
                    nombre_producto: "$productos.descripcion",
                    precio: "$productos.precio",
                },
            },
        ]);

        // Si no se encuentran productos, devolver un mensaje adecuado
        if (productos.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron productos para esta marca.",
            });
        }

        // Responder con los productos encontrados
        res.status(200).json({
            success: true,
            data: productos,
        });
    } catch (error) {
        // Manejar errores
        res.status(500).json({
            success: false,
            message: "Error al obtener los productos por marca.",
            error: error.message,
        });
    }
};

//------------------------------------------------------------------------------




//Q3. Listar los productos de una marca específica y los clientes que los han agregado a su carrito.

const getProductosYClientesPorMarca = async (req, res) => {
    try {
        const { marca } = req.params; // Obtenemos la marca desde los parámetros de la solicitud

        // Usamos el pipeline de agregación
        const resultado = await tiendaModel.aggregate([
            { $unwind: "$productos" }, // Desenrollamos los productos
            { $match: { "productos.marca": marca } }, // Filtramos por la marca deseada
            { $unwind: "$usuarios" }, // Desenrollamos los usuarios
            { $unwind: "$usuarios.carrito.productos" }, // Desenrollamos los productos del carrito
            {
                $match: {
                    $expr: { $eq: ["$usuarios.carrito.productos.producto_id", "$productos._id"] } // Coincidimos IDs
                }
            },
            {
                $project: {
                    _id: 0,
                    marca: "$productos.marca",
                    producto: "$productos.descripcion", // Nombre del producto
                    cliente: "$usuarios.nombre" // Nombre del cliente
                }
            }
        ]);

        // Respondemos con los resultados
        res.status(200).json({
            message: "Q3. Listar los productos de una marca específica y los clientes que los han agregado a su carrito.",
            success: true,
            data: resultado,
        });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({
            success: false,
            message: "Error al obtener los productos y clientes por marca.",
            error: error.message,
        });
    }
};
//--------------------------------------------------------------------------------






//Q4. Listar los productos que ha agregado un cliente en específico a su carrito de compras.

const getProductosCarritoCliente = async (req, res) => {
    try {
        const { nombreCliente } = req.params; // Recibe el nombre del cliente como parámetro

        const resultado = await tiendaModel.aggregate([
            { $unwind: "$usuarios" }, // Desenrollamos los usuarios
            { $match: { "usuarios.nombre": nombreCliente } }, // Filtramos por el nombre del cliente
            { $unwind: "$usuarios.carrito.productos" }, // Desenrollamos los productos del carrito
            {
                $addFields: {
                    producto_detalle: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$productos", // Lista de productos de la tienda
                                    as: "producto",
                                    cond: { $eq: ["$$producto._id", "$usuarios.carrito.productos.producto_id"] } // Coincidencia por ID
                                }
                            }, 0
                        ]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    usuario: "$usuarios.nombre",
                    nombre_producto: "$producto_detalle.descripcion", // Descripción del producto
                    cantidad: "$usuarios.carrito.productos.cantidad" // Cantidad del carrito
                }
            }
        ]);

        if (!resultado || resultado.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No se encontraron productos en el carrito para el cliente ${nombreCliente}.`
            });
        }

        res.status(200).json({ 
            message: "Q4. Listar los productos que ha agregado un cliente en específico a su carrito de compras.",
            success: true, 
            data: resultado });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los productos en el carrito del cliente.",
            error: error.message,
        });
    }
};

//----------------------------------------------------------------------------




// Q5. Listar los productos con mejores valoraciones.
const getComentariosPorValoracion = async (req, res) => {
    try {
      const resultado = await tiendaModel.aggregate([
        // Desenrollamos los productos de la tienda
        { $unwind: "$productos" },
  
        // Calculamos la valoración promedio de cada producto, filtrando los comentarios relevantes
        {
          $addFields: {
            valoracion_promedio: {
              $avg: {
                $map: {
                  input: {
                    $filter: {
                      input: "$comentarios",
                      as: "comentario",
                      cond: { $eq: ["$$comentario.producto_id", "$productos._id"] }
                    }
                  },
                  as: "comentario",
                  in: "$$comentario.valoracion"
                }
              }
            }
          }
        },
  
        // Desenrollamos los comentarios después de calcular la valoración promedio
        { $unwind: "$comentarios" },
  
        // Filtramos los comentarios con una valoración mayor que el promedio
        {
          $match: {
            $expr: { $gt: ["$comentarios.valoracion", "$valoracion_promedio"] }
          }
        },
  
        // Proyectamos los campos que queremos mostrar
        {
          $project: {
            _id: 0,
            producto_id: "$comentarios.producto_id",
            valoracion: "$comentarios.valoracion",
            comentario: "$comentarios.comentario",
            valoracion_promedio: 1  // Incluimos la valoración promedio
          }
        }
      ]);
  
      if (!resultado || resultado.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No se encontraron comentarios con valoraciones superiores al promedio."
        });
      }
  
      res.status(200).json({ 
        message: "Q5. Listar los productos con mejores valoraciones.",
        success: true,
         data: resultado });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener los comentarios con valoraciones superiores al promedio.",
        error: error.message,
      });
    }
  };
  
//--------------------------------------------------------------------------------



//Q6.  Listar los productos más agregados a los carritos de compra.

const getProductosMasAgregados = async (req, res) => {
    try {
      const resultado = await tiendaModel.aggregate([
        { $unwind: "$usuarios" }, // Desenrollamos los usuarios
        { $unwind: "$usuarios.carrito.productos" }, // Desenrollamos los productos en el carrito
        { $group: {
            _id: "$usuarios.carrito.productos.producto_id", // Agrupamos por id de producto
            total_agregados: { $sum: "$usuarios.carrito.productos.cantidad" } // Sumamos la cantidad de cada producto
        }},
        { $lookup: {
            from: "tiendas", // Buscamos en la misma colección de tiendas
            localField: "_id", // Comparamos el _id del producto con el producto_id en los productos de la tienda
            foreignField: "productos._id", // Relacionamos con el _id del producto
            as: "producto_info" // Creamos un array con la información del producto
        }},
        { $unwind: "$producto_info" }, // Desenrollamos el array de producto_info para obtener el producto único
        { $project: {
            _id: 0,
            producto_id: "$_id", // Proyectamos el id del producto
            nombre_producto: { $arrayElemAt: ["$producto_info.productos.descripcion", 0] }, // Seleccionamos el primer elemento del array de productos
            precio_producto: { $arrayElemAt: ["$producto_info.productos.precio", 0] }, // Seleccionamos el precio del primer producto
            categoria_producto: { $arrayElemAt: ["$producto_info.productos.categoria", 0] }, // Seleccionamos la categoría del primer producto
            total_agregados: 1 // Proyectamos la cantidad total agregada
        }},
        { $sort: { total_agregados: -1 } }, // Ordenamos por cantidad total agregada
        { $limit: 10 } // Limitar a los primeros 10 productos más agregados
      ]);
  
      if (!resultado || resultado.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No se encontraron productos más agregados."
        });
      }
  
      res.status(200).json({
         message:"Q6.  Listar los productos más agregados a los carritos de compra." ,
         success: true, 
        data: resultado });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener los productos más agregados.",
        error: error.message,
      });
    }
  };







//Q7. Listar todos los pedidos (incluyendo los productos) de un cliente en específico.
const getPedidosPorUsuario = async (req, res) => {
    try {
      const resultado = await tiendaModel.aggregate([
        { $unwind: "$usuarios" }, // Desenrollamos los usuarios
        { $match: { "usuarios._id": 1 } }, // Filtramos por el usuario con _id: 1 (Juan Pérez)
        { $lookup: { // Hacemos un 'lookup' con la colección de pedidos
            from: "tiendas", // La misma colección
            localField: "usuarios._id", // El campo _id del usuario
            foreignField: "pedidos.usuario_id", // El campo usuario_id en los pedidos
            as: "pedidos_usuario" // Nombre del campo donde se almacenarán los pedidos encontrados
        }},
        { $unwind: "$pedidos_usuario" }, // Desenrollamos los pedidos asociados a este usuario
        { $project: { // Proyectamos los campos que necesitamos
            nombre_usuario: "$usuarios.nombre",
            pedido_id: "$pedidos_usuario._id",
            estado_pedido: "$pedidos_usuario.estado",
            productos: "$pedidos_usuario.productos"
        }}
      ]);
  
      if (!resultado || resultado.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No se encontraron pedidos para este usuario."
        });
      }
  
      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener los pedidos del usuario.",
        error: error.message,
      });
    }
  };

  //----------------------------------------------------------------------------






//Q8.Listar todos los productos que ha adquirido un cliente en específico.
  const getProductosDePedidoPorUsuario = async (req, res) => {
    try {
      const usuarioId = parseInt(req.params.id); // Obtener el ID del usuario desde la URL
  
      const resultado = await tiendaModel.aggregate([
        { $unwind: "$usuarios" }, // Desenrollamos los usuarios
        { $match: { "usuarios._id": usuarioId } }, // Filtramos por el _id del usuario
        { $unwind: "$pedidos" }, // Desenrollamos los pedidos del usuario
        { $match: { "pedidos.usuario_id": usuarioId } }, // Filtramos por el usuario específico en los pedidos
        { $unwind: "$pedidos.productos" }, // Desenrollamos los productos dentro de cada pedido
        { $lookup: {
            from: "tiendas", // Usamos la colección correcta, que en este caso parece ser "tiendas"
            localField: "pedidos.productos.producto_id", // Usamos el producto_id del pedido
            foreignField: "productos._id", // Relacionamos con el campo _id de productos en la tienda
            as: "producto_detalles" // Los detalles del producto serán almacenados aquí
        }},
        { $unwind: { path: "$producto_detalles", preserveNullAndEmptyArrays: true } }, // Desenrollamos los detalles del producto
        // Proyección para mostrar solo los campos necesarios
        { $project: {
            nombre_cliente: "$usuarios.nombre", // Nombre del cliente
            nombre_producto: { $arrayElemAt: ["$producto_detalles.productos.descripcion", 0] }, // Nombre del producto (descripción)
            categoria_producto: { $arrayElemAt: ["$producto_detalles.productos.categoria", 0] }, // Categoría del producto
            precio_producto: { $arrayElemAt: ["$producto_detalles.productos.precio", 0] }, // Precio del producto
            cantidad: "$pedidos.productos.cantidad", // Cantidad de cada producto en el pedido
            producto_id: "$pedidos.productos.producto_id" // Incluimos el producto_id
        }}
      ]);
  
      if (!resultado || resultado.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No se encontraron productos para el usuario con id ${usuarioId}.`
        });
      }
  
      res.status(200).json({ 
        message: "Q8. Listar todos los productos que ha adquirido un cliente en específico.",
        success: true, data: resultado });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener los productos del pedido.",
        error: error.message,
      });
    }
  };
//----------------------------------------------------------------------------





//Q9  Listar todos los Clientes que han comprado un producto en específico.

const getProductosEnCarritoPorUsuario = async (req, res) => {
    try {
      const productoId = parseInt(req.params.productoId); // Obtener el ID del producto desde la URL
  
      const resultado = await tiendaModel.aggregate([
        { $unwind: "$usuarios" }, // Desenrollamos los usuarios
        { $unwind: "$usuarios.carrito.productos" }, // Desenrollamos los productos del carrito
        { $match: { "usuarios.carrito.productos.producto_id": productoId } }, // Filtramos por producto_id específico
        { $project: { 
            usuario: "$usuarios.nombre", // Nombre del usuario
            producto_id: "$usuarios.carrito.productos.producto_id", // ID del producto
            cantidad: "$usuarios.carrito.productos.cantidad" // Cantidad del producto en el carrito
        }}
      ]);
  
      if (!resultado || resultado.length === 0) {
        return res.status(404).json({
          message:'Q9  Listar todos los Clientes que han comprado un producto en específico.',
          success: false,
          message: `No se encontraron productos con el id ${productoId} en el carrito de los usuarios.`
        });
      }
  
      res.status(200).json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener los productos en el carrito.",
        error: error.message,
      });
    }
  };
//----------------------------------------------------------------------------  
  
  
module.exports = {
    getUsuarios,
    getProductosPorCategoria,
    getProductosPorMarca,
    getProductosYClientesPorMarca,
    getProductosCarritoCliente,
    getComentariosPorValoracion,
    getProductosMasAgregados,
    getPedidosPorUsuario,
    getProductosDePedidoPorUsuario,
    getProductosEnCarritoPorUsuario

};
