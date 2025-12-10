#!/usr/bin/env node

/**
 * Module dependencies.
 */

/**
 * Punto de Entrada del Servidor Backend.
 *
 * Script ejecutable que inicia el servidor HTTP de Node.js con Express.
 * Maneja la normalización de puertos, gestión de errores de servidor
 * y logging de eventos importantes.
 *
 * Flujo de inicio:
 * 1. Carga la aplicación Express desde ./app.js
 * 2. Obtiene el puerto de la variable de entorno PORT (default 3000)
 * 3. Crea un servidor HTTP nativo con http.createServer()
 * 4. Registra listeners para errores y eventos de escucha
 * 5. Inicia el servidor en el puerto especificado
 *
 * Errores manejados:
 * - EACCES: Puerto requiere permisos elevados (sudo)
 * - EADDRINUSE: Puerto ya está en uso
 * - Otros: Re-lanzados para manejo en nivel superior
 *
 * Variables de entorno:
 * - PORT: Puerto donde escuchar (defecto 3000)
 *
 * @module backend/server
 * @requires ./app
 * @requires debug
 * @requires http
 * @example
 * # Iniciar servidor
 * node src/index.js
 * # Servidor escuchando en puerto 3000
 *
 * @example
 * # Especificar puerto diferente
 * PORT=5000 node src/index.js
 * # Servidor escuchando en puerto 5000
 */

const app = require('./app');
const debug = require('debug')('backend:server');
const http = require('http');

/**
 * Obtener puerto de la configuración.
 *
 * Obtiene el puerto desde:
 * 1. Variable de entorno PORT (si está definida)
 * 2. Fallback a '3000' si no está configurada
 * 3. Normaliza el valor usando normalizePort()
 *
 * @type {string|number|boolean}
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Crear servidor HTTP.
 *
 * Crea una instancia de servidor HTTP nativo que sirve la aplicación Express.
 * El servidor es lo que realmente escucha en el puerto especificado.
 *
 * @type {http.Server}
 */
const server = http.createServer(app);

/**
 * Iniciar escucha en puerto.
 *
 * Comienza a escuchar en el puerto especificado.
 * Los eventos 'error' y 'listening' se registran después.
 */
server.listen(port);

/**
 * Registrar manejador de errores del servidor.
 *
 * Captura errores del servidor HTTP como problemas de puerto.
 */
server.on('error', onError);

/**
 * Registrar manejador de evento listening.
 *
 * Se ejecuta cuando el servidor comienza a escuchar exitosamente.
 * Registra en debug el puerto/pipe donde escucha.
 */
server.on('listening', onListening);

/**
 * Normaliza un valor de puerto.
 *
 * Convierte el valor de puerto (desde variable de entorno o parámetro)
 * a un formato válido: número positivo, nombre de pipe, o false.
 *
 * Proceso:
 * 1. Intenta parsear como número entero
 * 2. Si no es número (NaN), asume que es nombre de pipe
 * 3. Si es número negativo, retorna false
 * 4. Si es número >= 0, lo retorna como número válido
 *
 * @function normalizePort
 * @param {string|number} val - Valor de puerto a normalizar
 * @returns {number|string|boolean} Puerto normalizado
 *   - Número positivo (ej: 3000)
 *   - String pipe name (ej: '/tmp/socket')
 *   - false si es inválido
 *
 * @example
 * normalizePort('3000')  // 3000 (número)
 * normalizePort('abc')   // 'abc' (nombre de pipe)
 * normalizePort('-1')    // false (inválido)
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Manejador de errores del servidor HTTP.
 *
 * Procesa errores específicos del servidor:
 * - EACCES: El puerto requiere permisos elevados (root/sudo)
 * - EADDRINUSE: El puerto ya está siendo usado por otro proceso
 * - Otros errores: Re-lanzados para manejo superior
 *
 * Errores EACCES y EADDRINUSE terminan el proceso con exit(1).
 *
 * @function onError
 * @param {Error} error - Error del servidor
 * @param {string} error.syscall - System call que causó el error
 * @param {string} error.code - Código de error (EACCES, EADDRINUSE, etc.)
 * @throws {Error} Si no es error EACCES o EADDRINUSE
 *
 * @example
 * // EACCES: requiere sudo
 * // Imprime: "Port 3000 requires elevated privileges"
 * // Exit code: 1
 *
 * @example
 * // EADDRINUSE: puerto en uso
 * // Imprime: "Port 3000 is already in use"
 * // Exit code: 1
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Manejador del evento "listening" del servidor.
 *
 * Se ejecuta cuando el servidor comienza a escuchar exitosamente.
 * Registra en el debug logger (con namespace 'backend:server') dónde está escuchando.
 *
 * Útil para verificar que el servidor inició correctamente.
 * El output solo se ve si DEBUG=backend:server está configurado.
 *
 * @function onListening
 *
 * @example
 * # Mostrar output de debug
 * DEBUG=backend:server node src/index.js
 * # Output: backend:server Listening on port 3000
 *
 * @example
 * # Sin debug (uso normal)
 * node src/index.js
 * # (Sin output de listening, pero servidor funcionando)
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
