/**
 * Utilidades de JWT (JSON Web Tokens).
 *
 * Proporciona funciones para generar, verificar y decodificar tokens JWT.
 * Los tokens se usan para autenticación sin estado en la API REST.
 *
 * Configuración:
 * - JWT_SECRET: Clave secreta para firmar tokens (variable de entorno o default)
 * - JWT_EXPIRES_IN: Duración del token (defecto: 7 días)
 * - Refresh tokens: Duración mayor (30 días) para renovación
 *
 * @module utils/jwtHelper
 * @requires jsonwebtoken
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambialo';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'; // 7 días por defecto

/**
 * Genera un JWT para un usuario autenticado.
 *
 * El token contiene:
 * - `id`: ID del usuario (convertido a string)
 * - `email`: Email del usuario
 * - `iat`: Timestamp de emisión (automático)
 * - `exp`: Timestamp de expiración
 *
 * Token válido por defecto 7 días (configurable en JWT_EXPIRES_IN).
 *
 * @function generateToken
 * @param {Object} user - Objeto usuario
 * @param {string|ObjectId} user._id - ID del usuario (será convertido a string)
 * @param {string} user.email - Email del usuario
 * @returns {string} Token JWT firmado válido para 7 días
 *
 * @example
 * const token = generateToken({
 *   _id: '507f1f77bcf86cd799439011',
 *   email: 'juan@example.com'
 * });
 * // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
const generateToken = (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

/**
 * Verifica y decodifica un token JWT.
 *
 * Valida la firma del token contra JWT_SECRET.
 * Si la firma es válida y el token no ha expirado, retorna el payload.
 * Si el token es inválido o ha expirado, lanza un error.
 *
 * @function verifyToken
 * @param {string} token - Token JWT a verificar
 * @returns {Object} Payload del token decodificado
 * @returns {string} return.id ID del usuario
 * @returns {string} return.email Email del usuario
 * @returns {number} return.iat Timestamp de emisión (Unix)
 * @returns {number} return.exp Timestamp de expiración (Unix)
 * @throws {Error} Si token es inválido, ha expirado, o la firma no coincide
 *
 * @example
 * try {
 *   const decoded = verifyToken(token);
 *   console.log(decoded.id); // '507f1f77bcf86cd799439011'
 * } catch (error) {
 *   console.error('Token inválido o expirado');
 * }
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw error;
  }
};

/**
 * Genera un Refresh Token para renovación de sesión.
 *
 * Similar a generateToken, pero:
 * - Válido por 30 días (mayor duración)
 * - Incluye `type: 'refresh'` para identificarlo
 * - Usado solo para obtener nuevos access tokens
 *
 * Flujo típico:
 * 1. Usuario obtiene access_token (7 días) y refresh_token (30 días)
 * 2. Cuando access_token expira, usa refresh_token para obtener uno nuevo
 * 3. Refresh_token se renueva automáticamente si es válido
 *
 * @function generateRefreshToken
 * @param {Object} user - Objeto usuario
 * @param {string|ObjectId} user._id - ID del usuario
 * @returns {string} Refresh Token JWT válido por 30 días
 *
 * @example
 * const refreshToken = generateRefreshToken({
 *   _id: '507f1f77bcf86cd799439011'
 * });
 * // Use this to get new access tokens when the old one expires
 */
const generateRefreshToken = (user) => {
  const payload = {
    id: user._id.toString(),
    type: 'refresh'
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d' // 30 días para refresh
  });
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken
};

