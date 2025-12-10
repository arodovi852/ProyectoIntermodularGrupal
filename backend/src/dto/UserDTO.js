/**
 * Data Transfer Object para User.
 *
 * Centraliza la validación y transformación de datos relacionados con usuarios
 * entre las distintas capas de la aplicación (controladores, servicios y modelos).
 *
 * Responsabilidades principales:
 * - Validar datos de registro, login y cambio de contraseña.
 * - Formatear documentos de Mongoose a respuestas JSON consistentes sin exponer datos sensibles.
 * - Normalizar datos de entrada (trim, lowercase para emails).
 * - Construir respuestas con información del usuario y sus playlists asociadas.
 *
 * @class UserDTO
 */

class UserDTO {
  /**
   * Convierte datos de entrada (request) en un objeto válido para crear un usuario.
   *
   * Valida que los campos obligatorios estén presentes y aplica normalización:
   * - `name` se trimea de espacios.
   * - `email` se trimea y convierte a minúsculas.
   * - `password` se mantiene como viene (será hasheado en el servicio).
   *
   * @static
   * @param {Object} data Datos de la petición para registrar usuario.
   * @param {string} data.name Nombre del usuario.
   * @param {string} data.email Email del usuario (único).
   * @param {string} data.password Contraseña en texto plano.
   * @returns {Object} Objeto listo para ser utilizado por la capa de persistencia.
   * @throws {Error} Si falta algún campo requerido.
   *
   * @example
   * const validated = UserDTO.toCreate({ name: 'Juan', email: 'juan@mail.com', password: '123456' });
   */
  static toCreate(data) {
    const { name, email, password } = data;

    if (!name || !email || !password) {
      throw new Error('Nombre, email y contraseña son requeridos');
    }

    return {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password // Se hasheará en el servicio
    };
  }

  /**
   * Convierte datos de entrada en un objeto de actualización parcial de usuario.
   *
   * Solo incluye en el resultado los campos presentes en `data`. Si se recibe
   * `name` o `email`, se normalizan (trim y lowercase para email).
   * Los campos no incluidos en el objeto de entrada no aparecen en el resultado.
   *
   * @static
   * @param {Object} data Datos de la petición para actualizar usuario.
   * @param {string} [data.name] Nuevo nombre del usuario.
   * @param {string} [data.email] Nuevo email del usuario.
   * @returns {Object} Objeto con solo los campos a actualizar.
   */
  static toUpdate(data) {
    const updates = {};

    if (data.name !== undefined) {
      updates.name = data.name.trim();
    }

    if (data.email !== undefined) {
      updates.email = data.email.trim().toLowerCase();
    }

    return updates;
  }

  /**
   * Convierte un documento de User (Mongoose) en una respuesta pública sin datos sensibles.
   *
   * Transforma el formato interno de base de datos al formato JSON normalizado
   * para enviar al cliente. Excluye explícitamente la contraseña y otros datos sensibles.
   * Incluye:
   * - Conversión de `_id` a `id`.
   * - Datos básicos del usuario (nombre, email).
   * - Timestamps de creación y actualización.
   *
   * @static
   * @param {Object|null} user Documento de User (Mongoose) o `null`.
   * @returns {Object|null} Objeto plano con información pública, o `null` si no hay usuario.
   *
   * @example
   * const response = UserDTO.toResponse(userDocument);
   * // { id: '..', name: 'Juan', email: 'juan@mail.com', ... }
   */
  static toResponse(user) {
    if (!user) return null;

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at || user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  /**
   * Convierte un array de documentos User en un array de respuestas públicas.
   *
   * Utiliza {@link toResponse} para procesar cada usuario del array.
   * Si el parámetro no es un array válido, devuelve un array vacío.
   *
   * @static
   * @param {Array} users Array de documentos User (Mongoose).
   * @returns {Object[]} Array de usuarios formateados, o array vacío si la entrada es inválida.
   */
  static toResponseBatch(users) {
    if (!Array.isArray(users)) return [];
    return users.map(user => this.toResponse(user));
  }

  /**
   * Valida y normaliza datos de login (credenciales).
   *
   * Extrae `email` y `password` del objeto de entrada, normalizando el email
   * (trim y lowercase) para consulta consistente en base de datos.
   * La contraseña se mantiene como viene (será verificada contra hash en el servicio).
   *
   * @static
   * @param {Object} data Datos de la petición de login.
   * @param {string} data.email Email del usuario.
   * @param {string} data.password Contraseña en texto plano.
   * @returns {Object} Credenciales validadas listas para verificación.
   * @throws {Error} Si faltan email o contraseña.
   *
   * @example
   * const credentials = UserDTO.toLogin({ email: 'juan@mail.com', password: '123456' });
   */
  static toLogin(data) {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    return {
      email: email.trim().toLowerCase(),
      password
    };
  }

  /**
   * Valida datos para cambio de contraseña.
   *
   * Comprueba que:
   * - Se proporcione contraseña actual y nueva.
   * - La nueva contraseña tenga al menos 6 caracteres.
   *
   * Ambas contraseñas se mantienen como vienen (sin hashear, será responsabilidad
   * del servicio verificar la actual contra el hash y hashear la nueva).
   *
   * @static
   * @param {Object} data Datos de la petición para cambiar contraseña.
   * @param {string} data.currentPassword Contraseña actual del usuario.
   * @param {string} data.newPassword Nueva contraseña (mínimo 6 caracteres).
   * @returns {Object} Datos validados con ambas contraseñas.
   * @throws {Error} Si faltan contraseñas o la nueva es muy corta.
   *
   * @example
   * const changeData = UserDTO.toChangePassword({ currentPassword: 'old123', newPassword: 'new123456' });
   */
  static toChangePassword(data) {
    const { currentPassword, newPassword } = data;

    if (!currentPassword || !newPassword) {
      throw new Error('Contraseña actual y nueva son requeridas');
    }

    if (newPassword.length < 6) {
      throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
    }

    return { currentPassword, newPassword };
  }

  /**
   * Convierte un usuario junto con sus playlists en una respuesta detallada.
   *
   * Combina la respuesta básica del usuario con un array de playlists formateadas,
   * incluyendo:
   * - Datos públicos del usuario.
   * - Número total de playlists (`playlistsCount`).
   * - Array de playlists con información básica (id, nombre, cantidad de tracks, portada).
   *
   * @static
   * @param {Object} user Documento de User (Mongoose).
   * @param {Array} [playlists=[]] Array de documentos Playlist del usuario.
   * @returns {Object} Usuario con información de playlists formateado.
   *
   * @example
   * const response = UserDTO.toResponseWithPlaylists(user, userPlaylists);
   * // { id: '..', name: 'Juan', email: '..', playlistsCount: 3, playlists: [...] }
   */
  static toResponseWithPlaylists(user, playlists = []) {
    return {
      ...this.toResponse(user),
      playlistsCount: playlists.length,
      playlists: playlists.map(p => ({
        id: p._id,
        name: p.name,
        trackCount: p.tracks?.length || 0,
        coverImageUrl: p.cover_image_url
      }))
    };
  }
}

module.exports = UserDTO;

