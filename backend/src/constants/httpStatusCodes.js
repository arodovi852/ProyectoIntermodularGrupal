/**
 * Constantes de códigos de estado HTTP.
 *
 * Centraliza los códigos de estado HTTP para evitar números mágicos
 * y mejorar la legibilidad del código.
 *
 * @module constants/httpStatusCodes
 */

/**
 * Códigos de estado HTTP de éxito (2xx).
 *
 * @constant {Object}
 */
const SUCCESS = {
    /** 200 - Solicitud exitosa */
    OK: 200,
    /** 201 - Recurso creado exitosamente */
    CREATED: 201,
    /** 202 - Solicitud aceptada para procesamiento */
    ACCEPTED: 202,
    /** 204 - Solicitud exitosa sin contenido */
    NO_CONTENT: 204
};

/**
 * Códigos de error del cliente (4xx).
 *
 * @constant {Object}
 */
const CLIENT_ERROR = {
    /** 400 - Solicitud incorrecta */
    BAD_REQUEST: 400,
    /** 401 - No autenticado */
    UNAUTHORIZED: 401,
    /** 403 - No autorizado (autenticado pero sin permisos) */
    FORBIDDEN: 403,
    /** 404 - Recurso no encontrado */
    NOT_FOUND: 404,
    /** 409 - Conflicto (ej: recurso duplicado) */
    CONFLICT: 409,
    /** 422 - Entidad no procesable (validación fallida) */
    UNPROCESSABLE_ENTITY: 422,
    /** 429 - Demasiadas solicitudes */
    TOO_MANY_REQUESTS: 429
};

/**
 * Códigos de error del servidor (5xx).
 *
 * @constant {Object}
 */
const SERVER_ERROR = {
    /** 500 - Error interno del servidor */
    INTERNAL_SERVER_ERROR: 500,
    /** 501 - No implementado */
    NOT_IMPLEMENTED: 501,
    /** 502 - Bad Gateway */
    BAD_GATEWAY: 502,
    /** 503 - Servicio no disponible */
    SERVICE_UNAVAILABLE: 503,
    /** 504 - Gateway Timeout */
    GATEWAY_TIMEOUT: 504
};

/**
 * Todos los códigos de estado HTTP combinados.
 *
 * @constant {Object}
 */
const HTTP_STATUS = {
    ...SUCCESS,
    ...CLIENT_ERROR,
    ...SERVER_ERROR
};

module.exports = {
    SUCCESS,
    CLIENT_ERROR,
    SERVER_ERROR,
    HTTP_STATUS
};

