/**
 * Controlador para Canciones (Songs)
 * Gestiona operaciones CRUD sobre canciones
 */

const songService = require('../services/songService');

/**
 * Obtener todas las canciones (con paginación)
 */
const getAllSongs = async (req, res) => {
  try {
    const result = await songService.getAllSongs(req.query);

    res.status(200).json({
      success: true,
      ...result.pagination,
      data: result.songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener una canción por ID
 */
const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await songService.getSongById(id);

    res.status(200).json({
      success: true,
      data: song
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
 * Crear una nueva canción (o actualizarla si ya existe)
 */
const createSong = async (req, res) => {
  try {
    const result = await songService.createOrUpdateSong(req.body);

    const statusCode = result.isNew ? 201 : 200;
    res.status(statusCode).json({
      success: true,
      created: result.isNew,
      data: result.song
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Crear múltiples canciones (batch)
 */
const createManySongs = async (req, res) => {
  try {
    const result = await songService.createOrUpdateSongsBatch(req.body.songs);

    res.status(201).json({
      success: true,
      saved: result.savedCount,
      errors: result.errorCount,
      data: result.saved,
      errorDetails: result.errors
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener múltiples canciones por sus IDs
 */
const getSongsByIds = async (req, res) => {
  try {
    const songs = await songService.getSongsByIds(req.body.ids);

    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Buscar canciones
 */
const searchSongs = async (req, res) => {
  try {
    const songs = await songService.searchSongs(req.query);

    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Eliminar una canción
 */
const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    await songService.deleteSong(id);

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

module.exports = {
  getAllSongs,
  getSongById,
  createSong,
  createManySongs,
  getSongsByIds,
  searchSongs,
  deleteSong
};

