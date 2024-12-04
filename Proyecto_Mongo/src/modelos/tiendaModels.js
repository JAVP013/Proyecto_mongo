
const mongoose = require('mongoose');  // Esta línea es esencial para poder usar mongoose


const productoSchema = mongoose.Schema({
    _id: { type: Number, required: true },
    categoria: { type: String, required: true },
    subcategoria: { type: String },
    marca: { type: String, required: true },
    modelo: { type: String },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    tallas_disponibles: { type: [String], required: true }
});


const comentarioSchema = mongoose.Schema({
    _id: { type: Number, required: true },
    usuario_id: { type: Number, required: true },
    producto_id: { type: Number, required: true },
    valoracion: { type: Number, required: true },
    comentario: { type: String }
});


const pedidoSchema = mongoose.Schema({
    _id: { type: Number, required: true },
    usuario_id: { type: Number, required: true },
    fecha_pedido: { type: Date, default: Date.now },
    estado: { type: String, required: true },
    productos: [{
        producto_id: { type: Number, required: true },
        cantidad: { type: Number, required: true }
    }],
    precio_total: { type: Number, required: true },
    metodo_pago: { type: String, required: true }
});

const carritoSchema = mongoose.Schema({
    productos: [{
        producto_id: { type: Number, required: true },
        cantidad: { type: Number, required: true }
    }]
});

const usuarioSchema = mongoose.Schema({
    _id: { type: Number, required: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    contraseña: { type: String, required: true },
    direccion_envio: { type: String, required: true },
    telefono: { type: String, required: true },
    carrito: { type: [carritoSchema]}
});



const tiendaSchema = mongoose.Schema({
    _id: { type: Number, required: true },
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    productos: { type: [productoSchema] },
    usuarios: { type: [usuarioSchema]},
    pedidos: { type: [pedidoSchema] },
    comentarios: { type: [comentarioSchema]}
});


const Tienda = mongoose.model('tiendas', tiendaSchema);
module.exports = Tienda