/**
 * Controlador para Playlists.
 * Gestiona operaciones CRUD y acciones relacionadas sobre playlists de usuario.
 *
 * Cada handler:
 * - Valida permisos usando la información de `req.user` (inyectada por el middleware de autenticación).
 * - Delega la lógica de negocio en `playlistService`.
 * - Devuelve respuestas JSON normalizadas con las claves `success`, `data` y `error`.
 */


const playlistService = require('../services/playlistService');

/**
 * Obtener todas las playlists de un usuario autenticado.
 *
 * Requiere que el middleware de autenticación haya añadido `req.user`
 * con el identificador del usuario en `req.user.id`.
 *
 * Parámetros de ruta:
 * - `userId` (string): identificador del usuario cuyas playlists se quieren consultar.
 *
 * Parámetros de consulta opcionales:
 * - Se pasan directamente a `playlistService.getUserPlaylists` para filtrado/paginación.
 *
 * Respuestas:
 * - 200 OK: `{ success: true, count, data: Playlist[] }`
 * - 403 Forbidden: si el `userId` de la ruta no coincide con `req.user.id`.
 * - 404 Not Found / 500 Internal Server Error: en función del mensaje de error del servicio.
 *
 * @async
 * @function getUserPlaylists
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const getUserPlaylists = async (req, res) => {
  try {
    const { userId } = req.params;

    // Comprobar que el token pertenezca al usuario solicitado
    if (String(userId) !== String(req.user?.id)) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado para ver estas playlists'
      });
    }

    const playlists = await playlistService.getUserPlaylists(userId, req.query);

    res.status(200).json({
      success: true,
      count: playlists.length,
      data: playlists
    });
  } catch (error) {
    const statusCode = error.message.includes('no encontrado') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Crear una nueva playlist.
 *
 * Espera en el cuerpo de la petición un objeto con la siguiente forma:
 * - `name` {string} Nombre de la playlist.
 * - `userId` {string} Identificador del usuario propietario.
 * - `tracks` {string[]} Array de IDs de canciones.
 * - `cover_image_url` {string} (opcional) URL de la imagen de portada.
 * - `spotify_url` {string|null} (opcional) URL asociada en Spotify.
 * - `config` {Object} Objeto de configuración de generación (tamaño, seeds, parámetros de audio, etc.).
 *
 * Respuestas:
 * - 201 Created: `{ success: true, data: Playlist }`
 * - 400 Bad Request / 404 Not Found: en función del mensaje de error del servicio.
 *
 * @async
 * @function createPlaylist
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const createPlaylist = async (req, res) => {
  try {
    const playlist = await playlistService.createPlaylist(req.body);

    res.status(201).json({
      success: true,
      data: playlist
    });
  } catch (error) {
    const statusCode = error.message.includes('no encontrado') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener los detalles completos de una playlist, incluyendo sus canciones.
 *
 * Requiere que el usuario autenticado sea propietario de la playlist.
 *
 * Parámetros de ruta:
 * - `id` (string): identificador de la playlist.
 *
 * Respuestas:
 * - 200 OK: `{ success: true, data: PlaylistConCanciones }`
 * - 403 Forbidden: si el usuario no es propietario.
 * - 404 Not Found / 500 Internal Server Error: en función del mensaje de error del servicio.
 *
 * @async
 * @function getPlaylistDetails
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const getPlaylistDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar propietario usando el service (lanza si no existe)
    const isOwner = await playlistService.isOwner(id, req.user?.id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado para ver esta playlist'
      });
    }

    const playlist = await playlistService.getPlaylistDetails(id);

    res.status(200).json({
      success: true,
      data: playlist
    });
  } catch (error) {
    const statusCode = error.message.includes('no encontrada') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Actualizar una playlist existente.
 *
 * Permite actualizar, entre otros:
 * - `name`
 * - `tracks`
 * - `cover_image_url`
 * - `spotify_url`
 * - `config`
 *
 * Solo el propietario de la playlist puede modificarla.
 *
 * Parámetros de ruta:
 * - `id` (string): identificador de la playlist.
 *
 * Respuestas:
 * - 200 OK: `{ success: true, data: PlaylistActualizada }`
 * - 403 Forbidden: si el usuario no es propietario.
 * - 404 Not Found / 400 Bad Request: en función del mensaje de error del servicio.
 *
 * @async
 * @function updatePlaylist
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar propietario
    const isOwner = await playlistService.isOwner(id, req.user?.id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado para modificar esta playlist'
      });
    }

    const playlist = await playlistService.updatePlaylist(id, req.body);

    res.status(200).json({
      success: true,
      data: playlist
    });
  } catch (error) {
    const statusCode = error.message.includes('no encontrada') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Eliminar una playlist.
 *
 * Solo el propietario de la playlist puede eliminarla.
 *
 * Parámetros de ruta:
 * - `id` (string): identificador de la playlist.
 *
 * Respuestas:
 * - 200 OK: `{ success: true, data: {} }`
 * - 403 Forbidden: si el usuario no es propietario.
 * - 404 Not Found / 500 Internal Server Error: en función del mensaje de error del servicio.
 *
 * @async
 * @function deletePlaylist
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar propietario
    const isOwner = await playlistService.isOwner(id, req.user?.id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado para eliminar esta playlist'
      });
    }

    await playlistService.deletePlaylist(id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    const statusCode = error.message.includes('no encontrada') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Añadir canciones a una playlist existente.
 *
 * El cuerpo de la petición debe incluir la información necesaria para que
 * `playlistService.addTracksToPlaylist` añada una o varias pistas (por ejemplo,
 * un array de IDs de canciones).
 *
 * Solo el propietario de la playlist puede modificarla.
 *
 * Parámetros de ruta:
 * - `id` (string): identificador de la playlist.
 *
 * Respuestas:
 * - 200 OK: `{ success: true, data: PlaylistActualizada }`
 * - 403 Forbidden: si el usuario no es propietario.
 * - 404 Not Found / 400 Bad Request: en función del mensaje de error del servicio.
 *
 * @async
 * @function addTracksToPlaylist
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const addTracksToPlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar propietario
    const isOwner = await playlistService.isOwner(id, req.user?.id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado para modificar esta playlist'
      });
    }

    const playlist = await playlistService.addTracksToPlaylist(id, req.body);

    res.status(200).json({
      success: true,
      data: playlist
    });
  } catch (error) {
    const statusCode = error.message.includes('no encontrada') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getUserPlaylists,
  createPlaylist,
  getPlaylistDetails,
  updatePlaylist,
  deletePlaylist,
  addTracksToPlaylist
};
