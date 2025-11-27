/**
 * Middleware de Autenticación JWT
 * Protege rutas verificando el token JWT
 */

const jwt = require('jsonwebtoken');

/**
 * Verificar token JWT en el header Authorization
 */
const authMiddleware = (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado'
      });
    }

    // Extraer token
    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambialo');

    // Añadir usuario al request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Error al verificar token'
    });
  }
};

/**
 * Middleware opcional - no falla si no hay token
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambialo');
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Continuar sin usuario autenticado
    next();
  }
};

/**
 * Verificar que el usuario solo acceda a sus propios recursos
 */
const verifyOwnership = (req, res, next) => {
  try {
    const userId = req.params.id || req.params.userId;
    
    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para acceder a este recurso'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error al verificar permisos'
    });
  }
};

module.exports = {
  authMiddleware,
  optionalAuth,
  verifyOwnership
};

