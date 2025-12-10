/**
 * Middleware de Autenticación JWT.
 *
 * Centraliza la verificación y validación de tokens JWT para proteger rutas privadas
 * de la aplicación. Proporciona tres estrategias de autenticación:
 *
 * 1. **authMiddleware**: Requerido - Falla si no hay token o es inválido.
 * 2. **optionalAuth**: Opcional - No falla si no hay token, pero lo valida si está presente.
 * 3. **verifyOwnership**: Valida que el usuario solo acceda a sus propios recursos.
 *
 * Responsabilidades:
 * - Extraer y validar tokens JWT del header Authorization.
 * - Decodificar tokens y extraer datos del usuario.
 * - Adjuntar información del usuario al objeto `req` para uso posterior.
 * - Gestionar errores específicos (token inválido, expirado, ausente).
 * - Proteger acceso a recursos basado en propiedad de usuario.
 *
 * @module middleware/authMiddleware
 * @requires jsonwebtoken
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticación obligatoria con JWT.
 *
 * Verifica que:
 * - Exista un header Authorization con formato `Bearer <token>`.
 * - El token sea válido y no haya expirado.
 * - El JWT_SECRET coincida con el usado para generar el token.
 *
 * Si la autenticación es exitosa, adjunta el usuario decodificado a `req.user`
 * para ser utilizado por los controladores. Si falla, devuelve un error 401.
 *
 * Errores manejados:
 * - **401 Token no proporcionado**: Si no hay header Authorization.
 * - **401 Token inválido**: Si el token no puede decodificarse.
 * - **401 Token expirado**: Si el token venció su fecha de validez.
 * - **500 Error al verificar**: Otros errores durante la verificación.
 *
 * @function authMiddleware
 * @param {Object} req Objeto de petición Express.
 * @param {string} req.headers.authorization Header con formato "Bearer <token>".
 * @param {Object} res Objeto de respuesta Express.
 * @param {Function} next Función para pasar al siguiente middleware.
 * @returns {void} Ejecuta `next()` si es válido, o envía respuesta de error.
 *
 * @example
 * // Uso en rutas privadas
 * app.get('/api/user/profile', authMiddleware, (req, res) => {
 *   // req.user contiene { id, email, ... }
 *   res.json({ user: req.user });
 * });
 *
 * @example
 * // Header requerido
 * // GET /api/user/profile HTTP/1.1
 * // Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
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
 * Middleware de autenticación opcional con JWT.
 *
 * Similar a {@link authMiddleware}, pero no falla si el token está ausente o inválido.
 * Permite que rutas sean accesibles para usuarios autenticados y sin autenticar.
 *
 * Comportamiento:
 * - Si hay header Authorization válido, decodifica el token y lo añade a `req.user`.
 * - Si no hay header o el token es inválido, continúa sin usuario autenticado.
 * - Siempre ejecuta `next()` sin importar el resultado de la verificación.
 *
 * Casos de uso:
 * - Rutas públicas que ofrecen información diferente si el usuario está autenticado.
 * - Endpoints que pueden filtrar resultados basándose en `req.user` si existe.
 * - Previo a controladores que verifican opcionalmente la identidad del usuario.
 *
 * @function optionalAuth
 * @param {Object} req Objeto de petición Express.
 * @param {string|undefined} req.headers.authorization Header opcional con formato "Bearer <token>".
 * @param {Object} res Objeto de respuesta Express.
 * @param {Function} next Función para pasar al siguiente middleware.
 * @returns {void} Siempre ejecuta `next()`, con o sin usuario autenticado.
 *
 * @example
 * // Ruta pública con información opcional personalizada
 * app.get('/api/playlists', optionalAuth, (req, res) => {
 *   if (req.user) {
 *     // Mostrar solo playlists del usuario
 *     res.json({ playlists: userPlaylists });
 *   } else {
 *     // Mostrar playlists populares
 *     res.json({ playlists: popularPlaylists });
 *   }
 * });
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
 * Middleware para verificar propiedad de recursos.
 *
 * Valida que el usuario autenticado solo pueda acceder a recursos que le pertenecen.
 * Compara el ID del usuario en `req.user.id` con el ID en los parámetros de la ruta.
 *
 * Comportamiento:
 * - Busca el ID del recurso en `req.params.id` o `req.params.userId`.
 * - Si coincide con `req.user.id`, continúa con `next()`.
 * - Si no coincide, devuelve error 403 (Forbidden) sin acceso.
 * - Si hay error interno, devuelve error 500.
 *
 * Importante:
 * - Debe usarse DESPUÉS de {@link authMiddleware} o {@link optionalAuth}.
 * - Requiere que `req.user` esté ya poblado con datos del usuario.
 * - Protege contra acceso no autorizado a recursos ajenos.
 *
 * @function verifyOwnership
 * @param {Object} req Objeto de petición Express.
 * @param {Object} req.user Usuario autenticado (debe estar presente).
 * @param {string} req.user.id ID del usuario autenticado.
 * @param {Object} req.params Parámetros de la ruta.
 * @param {string} [req.params.id] ID del recurso (ruta genérica).
 * @param {string} [req.params.userId] ID del usuario objetivo (ruta específica).
 * @param {Object} res Objeto de respuesta Express.
 * @param {Function} next Función para pasar al siguiente middleware.
 * @returns {void} Ejecuta `next()` si el usuario es propietario, o envía error 403/500.
 *
 * @example
 * // Proteger acceso a perfil del usuario
 * app.get('/api/users/:userId/profile', authMiddleware, verifyOwnership, (req, res) => {
 *   // Solo el usuario con userId puede acceder a su propio perfil
 *   res.json({ profile: req.user });
 * });
 *
 * @example
 * // Proteger actualización de playlist
 * app.put('/api/playlists/:id', authMiddleware, verifyOwnership, (req, res) => {
 *   // Solo el propietario puede editar su playlist
 *   Playlist.findByIdAndUpdate(req.params.id, req.body);
 * });
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

