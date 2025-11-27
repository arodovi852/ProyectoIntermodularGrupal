/**
 * Utilidades para JWT
 * Generación y verificación de tokens
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambialo';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'; // 7 días por defecto

/**
 * Generar token JWT para un usuario
 * @param {Object} user - Usuario (debe tener _id, email)
 * @returns {String} Token JWT
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
 * Verificar y decodificar token
 * @param {String} token - Token JWT
 * @returns {Object} Payload decodificado
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw error;
  }
};

/**
 * Generar token de refresh (duración mayor)
 * @param {Object} user - Usuario
 * @returns {String} Refresh token
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

