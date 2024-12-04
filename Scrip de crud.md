use tiendadb; // Selecciona o crea la base de datos

// Inserta la colección "productos"
db.productos.insertMany([
  {
    _id: 1,
    categoria: "Camisetas",
    subcategoria: "Manga corta",
    marca: "Nike",
    modelo: "A123",
    descripcion: "Camiseta deportiva",
    precio: 20.99,
    tallas_disponibles: ["S", "M", "L"]
  },
  {
    _id: 2,
    categoria: "Pantalones",
    subcategoria: "Jeans",
    marca: "Levis",
    modelo: "501",
    descripcion: "Jeans clásicos",
    precio: 49.99,
    tallas_disponibles: ["M", "L", "XL"]
  },
  {
    _id: 3,
    categoria: "Zapatos",
    subcategoria: "Deportivos",
    marca: "Adidas",
    modelo: "RunX",
    descripcion: "Zapatos para correr",
    precio: 79.99,
    tallas_disponibles: ["8", "9", "10"]
  }
]);

// Inserta la colección "usuarios"
db.usuarios.insertMany([
  {
    _id: 1,
    nombre: "Juan Pérez",
    email: "juan@example.com",
    contraseña: "123456",
    direccion_envio: "Av. Siempre Viva 123",
    telefono: "555-1234",
    carrito: {
      productos: [
        { producto_id: 1, cantidad: 2 },
        { producto_id: 2, cantidad: 1 }
      ]
    }
  },
  {
    _id: 2,
    nombre: "María Gómez",
    email: "maria@example.com",
    contraseña: "654321",
    direccion_envio: "Calle Falsa 456",
    telefono: "555-5678",
    carrito: {
      productos: [
        { producto_id: 3, cantidad: 1 }
      ]
    }
  }
]);

// Inserta la colección "pedidos"
db.pedidos.insertMany([
  {
    _id: 1,
    usuario_id: 1,
    fecha_pedido: new Date("2024-12-02T17:52:39.648Z"),
    estado: "pendiente",
    productos: [
      { producto_id: 1, cantidad: 1 },
      { producto_id: 2, cantidad: 2 }
    ],
    precio_total: 120.97,
    metodo_pago: "Tarjeta de crédito"
  },
  {
    _id: 2,
    usuario_id: 2,
    fecha_pedido: new Date("2024-12-02T17:52:39.648Z"),
    estado: "enviado",
    productos: [
      { producto_id: 3, cantidad: 1 }
    ],
    precio_total: 79.99,
    metodo_pago: "PayPal"
  }
]);

// Inserta la colección "comentarios"
db.comentarios.insertMany([
  {
    _id: 1,
    usuario_id: 1,
    producto_id: 1,
    valoracion: 4.5,
    comentario: "Excelente calidad"
  },
  {
    _id: 2,
    usuario_id: 2,
    producto_id: 2,
    valoracion: 5,
    comentario: "Muy cómodo"
  }
]);

// Inserta los productos ordenados por valoración (opcional, como colección separada)
db.productos_ordenados_por_valoracion.insertMany([
  {
    _id: 2,
    categoria: "Pantalones",
    subcategoria: "Jeans",
    marca: "Levis",
    modelo: "501",
    descripcion: "Jeans clásicos",
    precio: 49.99,
    valoracion_promedio: 5
  },
  {
    _id: 1,
    categoria: "Camisetas",
    subcategoria: "Manga corta",
    marca: "Nike",
    modelo: "A123",
    descripcion: "Camiseta deportiva",
    precio: 20.99,
    valoracion_promedio: 4.5
  }
]);
