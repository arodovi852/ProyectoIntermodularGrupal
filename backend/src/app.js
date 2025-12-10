/**
 * Aplicación Principal Express.
 *
 * Configura y crea la instancia principal de Express con:
 * - Middleware de logging, parsing, CORS
 * - Conexión a base de datos MongoDB
 * - Montaje de rutas API y rutas legacy
 * - Manejo de errores global
 * - Configuración de vistas EJS
 * - Variables de entorno con dotenv
 *
 * Arquitectura:
 * - Middleware global (CORS, logging, parsing)
 * - Rutas legacy (para compatibilidad)
 * - Rutas API v1 (autenticación, usuarios, playlists, canciones)
 * - Health check endpoint
 * - Error handling
 *
 * Variables de entorno usadas:
 * - PORT: Puerto del servidor (defecto 3000)
 * - NODE_ENV: Ambiente (development/production)
 * - MONGODB_URI: URL de conexión a MongoDB
 * - CORS_ORIGIN: Origen permitido para CORS (defecto *)
 *
 * @module backend/app
 * @requires express
 * @requires cors
 * @requires morgan
 * @requires dotenv
 * @requires ./config/database
 * @requires ./routes/*
 */

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');

// Rutas de la API
const authRoutes = require('./routes/authRoutes');
const userRoutesAPI = require('./routes/userRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const songRoutes = require('./routes/songRoutes');
const generateRoutes = require('../routes/generate');

/**
 * Instancia principal de Express.
 *
 * @type {express.Application}
 */
const app = express();

/**
 * Conexión a MongoDB.
 *
 * Inicializa la conexión a la base de datos MongoDB.
 * Realiza la conexión al iniciar la aplicación.
 * Los errores de conexión se manejan en el módulo database.js
 */
// Conectar a MongoDB
connectDB();

/**
 * Configuración de CORS (Cross-Origin Resource Sharing).
 *
 * Permite solicitudes desde:
 * - Método GET, POST, PUT, DELETE, PATCH
 * - Origen: * (todas las direcciones - para desarrollo)
 * - Credenciales: true (permite cookies y headers de autorización)
 *
 * Nota: En producción, especificar origin: 'https://dominio.com'
 * en lugar de '*' para mayor seguridad.
 *
 * @middleware cors
 */
// CORS - permitir frontend de Vite (puerto 5173)
app.use(cors({
    // origin: 'http://localhost:5173',
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

/**
 * Configuración de vistas (EJS).
 *
 * Configura el motor de plantillas EJS para renderizar vistas.
 * Las vistas se buscan en ./src/views/
 * Se usan principalmente para páginas de error.
 *
 * @type {string} views - Ruta al directorio de vistas
 */
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * Middleware de logging (Morgan).
 *
 * Registra todas las requests HTTP en consola.
 * Formato 'dev' incluye: método, ruta, estado, tiempo, bytes enviados.
 *
 * @middleware morgan
 */
app.use(logger('dev'));

/**
 * Middleware de parsing.
 *
 * - express.json(): Parsea request bodies con Content-Type: application/json
 * - express.urlencoded(): Parsea formularios URL-encoded
 * - cookieParser(): Parsea cookies
 * - express.static(): Sirve archivos estáticos (public/)
 *
 * @middleware express.json
 * @middleware express.urlencoded
 * @middleware cookieParser
 * @middleware express.static
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Rutas Legacy.
 *
 * Rutas heredadas para compatibilidad con versiones anteriores.
 * Pueden ser eliminadas si no son necesarias.
 *
 * @route GET / - Index principal
 * @route GET /users - Lista de usuarios legacy
 */
// Rutas legacy (puedes eliminarlas si no las necesitas)
app.use('/', indexRouter);
app.use('/users', usersRouter);

/**
 * Health Check Endpoint.
 *
 * Verificación de que el servidor está funcionando.
 * Útil para monitoreo y load balancers.
 *
 * @route GET /api/health
 * @access Public
 * @returns {Object} Estado del servidor
 * @returns {string} return.status - Siempre 'ok'
 * @returns {string} return.message - Mensaje descriptivo
 * @returns {string} return.timestamp - Timestamp ISO de la respuesta
 *
 * @example
 * GET /api/health
 * Response 200:
 * {
 *   "status": "ok",
 *   "message": "Backend funcionando",
 *   "timestamp": "2024-01-15T10:30:00.000Z"
 * }
 */
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend funcionando', timestamp: new Date().toISOString() });
});

/**
 * Rutas de API v1.
 *
 * Montaje de todas las rutas API organizadas por recurso:
 * - /api/auth - Autenticación (registro, login)
 * - /api/users - Gestión de usuarios
 * - /api/playlists - Gestión de playlists
 * - /api/songs - Gestión de canciones
 * - /api/generate - Generación de playlists
 *
 * @route /api/auth - {@link module:routes/authRoutes}
 * @route /api/users - {@link module:routes/userRoutes}
 * @route /api/playlists - {@link module:routes/playlistRoutes}
 * @route /api/songs - {@link module:routes/songRoutes}
 * @route /api/generate - {@link module:routes/generateRoutes}
 */
// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutesAPI);
app.use('/api/playlists', playlistRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/generate', generateRoutes);

/**
 * Middleware de manejo de 404.
 *
 * Captura todas las rutas no encontradas y crea un error 404.
 * El error se pasa al siguiente middleware (error handler).
 *
 * @middleware 404 handler
 */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * Middleware de manejo de errores global.
 *
 * Procesa todos los errores lanzados en la aplicación.
 * En desarrollo, retorna el stack de error completo.
 * En producción, oculta detalles del error por seguridad.
 *
 * Renderiza la vista error.ejs con detalles del error.
 *
 * @middleware error handler
 * @param {Error} err - Error capturado
 * @param {express.Request} req - Request Express
 * @param {express.Response} res - Response Express
 * @param {Function} next - Siguiente middleware (no usado en error handler)
 */
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
