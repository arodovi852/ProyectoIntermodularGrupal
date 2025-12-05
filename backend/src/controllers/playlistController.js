/**
 * Controlador para Playlists
 * Gestiona operaciones CRUD sobre playlists
 */

const playlistService = require('../services/playlistService');

/**
 * Obtener todas las playlists de un usuario
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
 * Crear una nueva playlist
 * Espera en req.body: { name, userId, tracks, cover_image_url, spotify_url, config }
 * config debe incluir: size, seeds, y opcionalmente negativeSeeds y parámetros de audio
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
 * Obtener detalles de una playlist con sus canciones
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
 * Actualizar una playlist
 * Puede actualizar: name, tracks, cover_image_url, spotify_url, config
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
 * Eliminar una playlist
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
 * Añadir canciones a una playlist
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
