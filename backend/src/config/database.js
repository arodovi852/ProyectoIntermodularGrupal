/**
 * Configuración de conexión a MongoDB con Mongoose.
 *
 * Maneja:
 * - Conexión inicial a MongoDB
 * - Eventos de conexión (error, disconnect)
 * - Cierre graceful al terminar la aplicación
 * - Logger profesional con Winston
 *
 * Configuración:
 * - URL de conexión desde MONGODB_URI en .env
 * - Fallback a MongoDB local si no está configurado
 *
 * @module config/database
 * @requires mongoose
 * @requires dotenv
 * @requires ../utils/logger
 */

const mongoose = require('mongoose');
const logger = require('../utils/logger');
require('dotenv').config();

/**
 * Conecta a la base de datos MongoDB.
 *
 * Establece la conexión con MongoDB usando Mongoose.
 * Configura event listeners para:
 * - Errores de conexión
 * - Desconexión
 * - Cierre graceful (SIGINT)
 *
 * Variables de entorno usadas:
 * - MONGODB_URI: URL de conexión a MongoDB
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} Si falla la conexión a MongoDB
 *
 * @example
 * const connectDB = require('./config/database');
 * await connectDB();
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mood-playlist-app', {
      // Opciones de configuración (ya no son necesarias en versiones recientes de Mongoose)
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    logger.info(`MongoDB conectado: ${conn.connection.host}`);
    logger.info(`Base de datos: ${conn.connection.name}`);

    // Manejo de eventos de conexión
    mongoose.connection.on('error', (err) => {
      logger.error(`Error de conexión MongoDB: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB desconectado');
    });

    // Cierre elegante de la conexión cuando la app se cierra
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Conexión MongoDB cerrada debido a la terminación de la aplicación');
      process.exit(0);
    });

  } catch (error) {
    logger.error(`Error al conectar con MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

