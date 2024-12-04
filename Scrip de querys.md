Q1. Listar los productos de una categoría específica.
db.tiendas.aggregate([
    { $unwind: "$productos" },
    { $match: { "productos.categoria": "Camisetas" } }, // Cambia "Camisetas" por la categoría que desees
    { $project: { _id: 0, nombre_producto: "$productos.descripcion", precio: "$productos.precio" } }
]);


Q2. Listar los productos de una marca específica.
db.tiendas.aggregate([
    { $unwind: "$productos" },
    { $match: { "productos.marca": "Nike" } }, // Cambia "Nike" por la marca que desees
    { $project: { _id: 0, nombre_producto: "$productos.descripcion", precio: "$productos.precio" } }
]);



Q3. Listar los productos de una marca específica y los clientes que los han agregado a su carrito.

db.tiendas.aggregate([
    { $unwind: "$productos" }, // Desenrollamos los productos
    { $match: { "productos.marca": "Nike" } }, // Filtramos por la marca deseada
    { $unwind: "$usuarios" }, // Desenrollamos los usuarios
    { $unwind: "$usuarios.carrito.productos" }, // Desenrollamos los productos del carrito
    { 
        $match: { 
            $expr: { $eq: ["$usuarios.carrito.productos.producto_id", "$productos._id"] } // Coincidimos IDs
        }
    },
    { 
        $project: { 
            _id: 0, marca:"$productos.marca",
            producto: "$productos.descripcion", // Nombre del producto
            cliente: "$usuarios.nombre" // Nombre del cliente
        } 
    }
]);





Q4. Listar los productos que ha agregado un cliente en específico a su carrito de compras.

db.tiendas.aggregate([
    { $unwind: "$usuarios" }, // Desenrollamos los usuarios
    { $match: { "usuarios.nombre": "Juan Pérez" } }, // Filtramos por el nombre del cliente
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
            nombre_producto: "$producto_detalle.descripcion", // Descripción del producto
            cantidad: "$usuarios.carrito.productos.cantidad" // Cantidad del carrito
        }
    }
]);


Q5. Listar los productos con mejores valoraciones.

db.tiendas.aggregate([
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



Q6. Listar los productos más agregados a los carritos de compra.

db.tiendas.aggregate([
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






