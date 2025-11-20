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
 */
const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
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

