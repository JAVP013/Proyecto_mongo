const dotenv = require('dotenv');
const mongoose = require ('mongoose');


const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.CONNECTION_STRING, {
            dbName: process.env.DATABASE
        });
        console.log('Conexion exitosa a la base de datos : ', db.connection.name);
    } catch (error) {
        console.log('Error en la conexion: ', error);
    }
};

module.exports = connectDB;