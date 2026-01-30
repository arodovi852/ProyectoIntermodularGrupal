/**
 * Configuración centralizada de la aplicación.
 *
 * Centraliza todas las variables de entorno y configuraciones
 * para evitar duplicación y facilitar mantenimiento.
 *
 * @module config/appConfig
 */

require('dotenv').config();

/**
 * Configuración de JWT (JSON Web Tokens).
 *
 * @constant {Object}
 * @property {string} secret - Clave secreta para firmar tokens
 * @property {string} expiresIn - Duración de tokens de acceso
 * @property {string} refreshExpiresIn - Duración de tokens de refresco
 */
const jwtConfig = {
    secret: process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambialo',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: '30d'
};

/**
 * Configuración de MongoDB.
 *
 * @constant {Object}
 * @property {string} uri - URI de conexión a MongoDB
 * @property {string} dbName - Nombre de la base de datos
 */
const mongoConfig = {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mood-playlist-app',
    dbName: process.env.DB_NAME || 'mood-playlist-app'
};

/**
 * Configuración de Spotify API.
 *
 * @constant {Object}
 * @property {string} clientId - Client ID de Spotify
 * @property {string} clientSecret - Client Secret de Spotify
 * @property {string} authUrl - URL de autenticación de Spotify
 * @property {string} apiUrl - URL base de la API de Spotify
 */
const spotifyConfig = {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    authUrl: 'https://accounts.spotify.com/api/token',
    apiUrl: 'https://api.spotify.com/v1'
};

/**
 * Configuración del servidor.
 *
 * @constant {Object}
 * @property {number} port - Puerto del servidor
 * @property {string} nodeEnv - Entorno de ejecución (development, production, test)
 * @property {string} frontendUrl - URL del frontend para CORS
 */
const serverConfig = {
    port: parseInt(process.env.PORT, 10) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};

/**
 * Configuración de logging.
 *
 * @constant {Object}
 * @property {string} level - Nivel de logging (debug, info, warn, error)
 * @property {boolean} enableConsole - Si habilitar logging en consola
 * @property {string} fileLevel - Nivel para archivos de log
 */
const logConfig = {
    level: process.env.LOG_LEVEL || (serverConfig.nodeEnv === 'production' ? 'info' : 'debug'),
    enableConsole: serverConfig.nodeEnv !== 'production',
    fileLevel: 'error'
};

/**
 * Configuración de CORS.
 *
 * @constant {Object}
 * @property {string|string[]} origin - Orígenes permitidos
 * @property {boolean} credentials - Si permitir credenciales
 * @property {string[]} methods - Métodos HTTP permitidos
 */
const corsConfig = {
    origin: serverConfig.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
};

/**
 * Configuración de bcrypt.
 *
 * @constant {Object}
 * @property {number} saltRounds - Número de rondas de sal para hash
 */
const bcryptConfig = {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10
};

/**
 * Verifica que las variables de entorno críticas estén configuradas.
 *
 * @function validateConfig
 * @throws {Error} Si falta alguna configuración crítica
 */
function validateConfig() {
    const requiredEnvVars = [
        'SPOTIFY_CLIENT_ID',
        'SPOTIFY_CLIENT_SECRET'
    ];

    const missing = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
        throw new Error(
            `Faltan las siguientes variables de entorno requeridas: ${missing.join(', ')}\n` +
            'Por favor, configura estas variables en tu archivo .env'
        );
    }

    // Advertencias para configuraciones no críticas pero recomendadas
    if (jwtConfig.secret === 'tu_secreto_super_seguro_cambialo') {
        console.warn('⚠️  ADVERTENCIA: Usando JWT_SECRET por defecto. Configura JWT_SECRET en .env para producción.');
    }

    if (serverConfig.nodeEnv === 'production' && mongoConfig.uri.includes('localhost')) {
        console.warn('⚠️  ADVERTENCIA: En producción pero usando MongoDB local. Verifica MONGODB_URI.');
    }
}

/**
 * Obtiene el entorno de ejecución actual.
 *
 * @function getEnvironment
 * @returns {Object} Información del entorno
 */
function getEnvironment() {
    return {
        nodeEnv: serverConfig.nodeEnv,
        isProduction: serverConfig.nodeEnv === 'production',
        isDevelopment: serverConfig.nodeEnv === 'development',
        isTest: serverConfig.nodeEnv === 'test'
    };
}

module.exports = {
    jwt: jwtConfig,
    mongo: mongoConfig,
    spotify: spotifyConfig,
    server: serverConfig,
    log: logConfig,
    cors: corsConfig,
    bcrypt: bcryptConfig,
    validateConfig,
    getEnvironment
};

