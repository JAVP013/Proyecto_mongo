
const monngoose = require('mongoose');

const usuarioSchema = monngoose.Schema({
    _id : {type:String},
    nombre : {type:String},
    email : {type:String},
    contraseña: {type:String},
    direccion_envio : {type:String},
    telefono : {type:String}
})
const Tienda = monngoose.model('Tienda', usuarioSchema);
module.exports = Tienda