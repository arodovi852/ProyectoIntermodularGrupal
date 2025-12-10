/**
 * Script de seeding para poblar la base de datos con datos iniciales.
 *
 * Permite:
 * - Crear usuarios de prueba con contraseñas hasheadas.
 * - Insertar un conjunto de canciones de ejemplo simulando respuestas de Spotify.
 * - Generar varias playlists preconfiguradas asociadas a esos usuarios y canciones.
 *
 * Uso:
 *   node src/config/seed.js
 *
 * El script:
 * - Conecta a MongoDB usando la URI de `MONGODB_URI` o una base local por defecto.
 * - Limpia las colecciones `User`, `Playlist` y `Song`.
 * - Inserta los documentos de ejemplo.
 * - Muestra un resumen por consola y cierra la conexión.
 *
 * Importante: los datos generados son únicamente para entornos de desarrollo
 * y demostración; no deben utilizarse en producción.
 */
const mongoose = require('mongoose');
require('dotenv').config();

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

