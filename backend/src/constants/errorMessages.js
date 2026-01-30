/**
 * Mensajes de error estandarizados.
 *
 * Centraliza todos los mensajes de error de la aplicación
 * para mantener consistencia y facilitar internacionalización futura.
 *
 * @module constants/errorMessages
 */

/**
 * Mensajes de error de autenticación.
 *
 * @constant {Object}
 */
const AUTH_ERRORS = {
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    TOKEN_NOT_PROVIDED: 'Token no proporcionado',
    TOKEN_INVALID: 'Token inválido',
    TOKEN_EXPIRED: 'Token expirado',
    TOKEN_VERIFICATION_FAILED: 'Error al verificar token',
    EMAIL_ALREADY_EXISTS: 'El email ya está registrado',
    UNAUTHORIZED_ACCESS: 'No autorizado para acceder a este recurso',
    INSUFFICIENT_PERMISSIONS: 'Permisos insuficientes'
};

/**
 * Mensajes de error de validación.
 *
 * @constant {Object}
 */
const VALIDATION_ERRORS = {
    REQUIRED_FIELD: (field) => `El campo ${field} es requerido`,
    INVALID_EMAIL: 'Email inválido',
    INVALID_FORMAT: (field) => `Formato inválido para ${field}`,
    MIN_LENGTH: (field, length) => `${field} debe tener al menos ${length} caracteres`,
    MAX_LENGTH: (field, length) => `${field} no puede exceder ${length} caracteres`,
    INVALID_VALUE: (field) => `Valor inválido para ${field}`,
    PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 6 caracteres',
    PASSWORDS_DONT_MATCH: 'Las contraseñas no coinciden'
};

/**
 * Mensajes de error de recursos.
 *
 * @constant {Object}
 */
const RESOURCE_ERRORS = {
    NOT_FOUND: (resource) => `${resource} no encontrado`,
    ALREADY_EXISTS: (resource) => `${resource} ya existe`,
    CREATION_FAILED: (resource) => `Error al crear ${resource}`,
    UPDATE_FAILED: (resource) => `Error al actualizar ${resource}`,
    DELETE_FAILED: (resource) => `Error al eliminar ${resource}`,
    FETCH_FAILED: (resource) => `Error al obtener ${resource}`
};

/**
 * Mensajes de error de la API de Spotify.
 *
 * @constant {Object}
 */
const SPOTIFY_ERRORS = {
    AUTH_FAILED: 'Error al autenticar con Spotify',
    API_ERROR: 'Error al comunicarse con la API de Spotify',
    INVALID_TRACK: 'Track de Spotify inválido',
    SEARCH_FAILED: 'Error al buscar en Spotify',
    RECOMMENDATION_FAILED: 'Error al obtener recomendaciones de Spotify',
    RATE_LIMIT_EXCEEDED: 'Límite de solicitudes a Spotify excedido'
};

/**
 * Mensajes de error de base de datos.
 *
 * @constant {Object}
 */
const DATABASE_ERRORS = {
    CONNECTION_FAILED: 'Error al conectar con la base de datos',
    QUERY_FAILED: 'Error al ejecutar consulta en la base de datos',
    DUPLICATE_KEY: 'Registro duplicado en la base de datos',
    VALIDATION_FAILED: 'Error de validación en la base de datos'
};

/**
 * Mensajes de error generales.
 *
 * @constant {Object}
 */
const GENERAL_ERRORS = {
    INTERNAL_SERVER_ERROR: 'Error interno del servidor',
    SERVICE_UNAVAILABLE: 'Servicio no disponible',
    BAD_REQUEST: 'Solicitud incorrecta',
    UNKNOWN_ERROR: 'Error desconocido'
};

/**
 * Mensajes de éxito.
 *
 * @constant {Object}
 */
const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login exitoso',
    REGISTER_SUCCESS: 'Registro exitoso',
    UPDATE_SUCCESS: (resource) => `${resource} actualizado exitosamente`,
    DELETE_SUCCESS: (resource) => `${resource} eliminado exitosamente`,
    CREATE_SUCCESS: (resource) => `${resource} creado exitosamente`,
    OPERATION_SUCCESS: 'Operación completada exitosamente'
};

module.exports = {
    AUTH_ERRORS,
    VALIDATION_ERRORS,
    RESOURCE_ERRORS,
    SPOTIFY_ERRORS,
    DATABASE_ERRORS,
    GENERAL_ERRORS,
    SUCCESS_MESSAGES
};

