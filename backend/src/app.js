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
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
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
 * =========================================
 * CONFIGURACIÓN DE SEGURIDAD - MIDDLEWARES
 * =========================================
 * Orden crítico para máxima seguridad:
 * 1. Helmet (headers de seguridad)
 * 2. CORS (control de acceso)
 * 3. Body parsers con límites
 * 4. Sanitización
 * 5. Rate limiting
 * 6. Logging
 */

/**
 * 1. Helmet - Configura headers HTTP de seguridad.
 *
 * Protege contra vulnerabilidades comunes:
 * - XSS (Cross-Site Scripting)
 * - Clickjacking
 * - MIME sniffing
 * - Información del servidor expuesta
 *
 * @middleware helmet
 */
app.use(helmet());

/**
 * 2. CORS - Control de acceso entre orígenes.
 *
 * Configuración segura:
 * - origin: Solo el dominio del frontend (desde variable de entorno)
 * - credentials: true (permite cookies y headers de autorización)
 * - methods: GET, POST, PUT, DELETE, PATCH
 *
 * IMPORTANTE: En producción, FRONTEND_URL debe ser tu dominio real.
 * Ejemplo: https://playthemood.com
 *
 * @middleware cors
 */
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

/**
 * 3. Body Parsers con límite de tamaño.
 *
 * Previene ataques de denegación de servicio (DoS) mediante payloads enormes.
 * Límite: 10MB (ajustar según necesidades de la aplicación)
 *
 * @middleware express.json
 * @middleware express.urlencoded
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

/**
 * 4. Sanitización contra inyección NoSQL.
 *
 * Express Mongo Sanitize elimina caracteres peligrosos como $ y .
 * que podrían usarse en ataques de inyección NoSQL.
 *
 * Ejemplos bloqueados:
 * - {"$gt": ""} en passwords
 * - {"username": {"$ne": null}}
 *
 * @middleware mongoSanitize
 */
app.use(mongoSanitize());

/**
 * 5. Rate Limiting - Limita peticiones por IP.
 *
 * Rate Limiter General: 100 peticiones cada 15 minutos
 * Aplica a todas las rutas excepto /api/health
 *
 * Previene:
 * - Ataques de fuerza bruta
 * - DDoS básicos
 * - Abuso de API
 *
 * @middleware rateLimit
 */
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 peticiones por ventana
    message: {
        error: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos'
    },
    standardHeaders: true, // Retorna info de rate limit en headers `RateLimit-*`
    legacyHeaders: false, // Desactiva headers `X-RateLimit-*`
    // Excluir health check del rate limiting
    skip: (req) => req.path === '/api/health'
});

/**
 * Rate Limiter Estricto para Login/Registro.
 *
 * Solo 5 intentos cada 15 minutos para rutas de autenticación.
 * Previene ataques de fuerza bruta en credenciales.
 *
 * @middleware rateLimit
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Solo 5 peticiones por ventana
    message: {
        error: 'Demasiados intentos de autenticación desde esta IP, por favor intenta de nuevo en 15 minutos'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Aplicar rate limiter general a todas las rutas
app.use(generalLimiter);

/**
 * 6. Otros middlewares.
 *
 * - cookieParser: Parsea cookies
 * - morgan: Logging de requests HTTP
 * - express.static: Sirve archivos estáticos
 */
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

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
 * - /api/auth - Autenticación (registro, login) - CON RATE LIMITING ESTRICTO
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
// Auth con rate limiting estricto (5 intentos cada 15 min)
app.use('/api/auth', authLimiter, authRoutes);
// Otras rutas con rate limiting general
app.use('/api/users', userRoutesAPI);
app.use('/api/playlists', playlistRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/generate', generateRoutes);

/**
 * Middleware de manejo de 404.
 *
 * Captura todas las rutas no encontradas y retorna error 404 en formato JSON.
 *
 * @middleware 404 handler
 */
app.use(function(req, res, next) {
  res.status(404).json({
    error: 'Not Found',
    message: `La ruta ${req.method} ${req.path} no existe`,
    path: req.path,
    method: req.method
  });
});

/**
 * Middleware de manejo de errores global.
 *
 * Procesa todos los errores lanzados en la aplicación.
 * Retorna respuesta en formato JSON apropiado para API REST.
 *
 * En desarrollo:
 * - Incluye stack trace completo del error
 * - Incluye detalles del error
 *
 * En producción:
 * - Oculta detalles internos por seguridad
 * - Solo muestra mensaje genérico
 *
 * @middleware error handler
 * @param {Error} err - Error capturado
 * @param {express.Request} req - Request Express
 * @param {express.Response} res - Response Express
 * @param {Function} next - Siguiente middleware (no usado en error handler)
 */
app.use(function(err, req, res, next) {
  // Determinar código de estado
  const statusCode = err.status || err.statusCode || 500;

  // Mensaje de error
  const message = err.message || 'Error interno del servidor';

  // Respuesta base
  const errorResponse = {
    error: true,
    message: message,
    status: statusCode
  };

  // En desarrollo, incluir detalles adicionales
  if (req.app.get('env') === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = err;
  }

  // Log del error en servidor (para debugging)
  console.error(`[ERROR ${statusCode}]`, message);
  if (req.app.get('env') === 'development') {
    console.error(err.stack);
  }

  // Enviar respuesta JSON
  res.status(statusCode).json(errorResponse);
});

module.exports = app;
