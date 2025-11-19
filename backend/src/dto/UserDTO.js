/**
 * Data Transfer Object para User
 * Transforma datos entre capas de la aplicación
 */

class UserDTO {
  /**
   * Convierte datos de entrada (request) a formato para crear usuario
   * @param {Object} data - Datos del request
   * @returns {Object} Datos validados para crear usuario
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
   * Convierte datos de entrada para actualización
   * @param {Object} data - Datos del request
   * @returns {Object} Datos validados para actualizar
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
   * Convierte modelo User a respuesta pública (sin password)
   * @param {Object} user - Documento de User (Mongoose)
   * @returns {Object} Usuario formateado para respuesta
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
   * Convierte múltiples usuarios a respuesta
   * @param {Array} users - Array de documentos User
   * @returns {Array} Array de usuarios formateados
   */
  static toResponseBatch(users) {
    if (!Array.isArray(users)) return [];
    return users.map(user => this.toResponse(user));
  }

  /**
   * Valida datos de login
   * @param {Object} data - Datos de login
   * @returns {Object} Credenciales validadas
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
   * Valida datos de cambio de contraseña
   * @param {Object} data - Datos de cambio de contraseña
   * @returns {Object} Datos validados
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
   * Convierte usuario con información extendida (incluye playlists)
   * @param {Object} user - Documento de User con playlists
   * @param {Array} playlists - Array de playlists del usuario
   * @returns {Object} Usuario con playlists formateado
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

