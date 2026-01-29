/**
 * Logger Profesional con Winston
 *
 * Sistema de logging centralizado para el backend.
 * Configura diferentes niveles de log y transportes según el entorno.
 *
 * Niveles de log (de más a menos crítico):
 * - error: Errores que requieren atención inmediata
 * - warn: Advertencias de situaciones anormales
 * - info: Información general del flujo de la aplicación
 * - http: Logs de peticiones HTTP
 * - debug: Información detallada para debugging
 *
 * Transportes:
 * - Archivo error.log: Solo errores
 * - Archivo combined.log: Todos los niveles
 * - Consola: Solo en desarrollo
 *
 * @module utils/logger
 */

const winston = require('winston');
const path = require('path');

/**
 * Formato personalizado para logs legibles
 */
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    if (stack) {
      return `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`;
    }
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

/**
 * Formato JSON para producción (más fácil de parsear)
 */
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Nivel de log según entorno
 */
const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

/**
 * Instancia del logger
 */
const logger = winston.createLogger({
  level: level,
  format: process.env.NODE_ENV === 'production' ? jsonFormat : customFormat,
  defaultMeta: { service: 'playthemood-backend' },
  transports: [
    // Archivo para errores
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Archivo para todos los logs
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

/**
 * En desarrollo, también log a consola con colores
 */
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

/**
 * Stream para Morgan (HTTP logging)
 */
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

module.exports = logger;

