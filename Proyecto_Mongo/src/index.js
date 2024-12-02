const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/mongoConnection');

dotenv.config();
PORT = process.env.PORT;

connectDatabase();

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});