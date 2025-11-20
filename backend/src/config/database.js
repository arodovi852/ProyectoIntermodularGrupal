const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Configuración y conexión a MongoDB usando Mongoose
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mood-playlist-app', {
      // Opciones de configuración (ya no son necesarias en versiones recientes de Mongoose)
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
    console.log(`Base de datos: ${conn.connection.name}`);

    // Manejo de eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error(`Error de conexión MongoDB: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB desconectado');
    });

    // Cierre elegante de la conexión cuando la app se cierra
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Conexión MongoDB cerrada debido a la terminación de la aplicación');
      process.exit(0);
    });

  } catch (error) {
    console.error(`Error al conectar con MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

