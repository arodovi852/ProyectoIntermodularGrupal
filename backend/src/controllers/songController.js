/**
 * Controlador para Canciones (Songs)
 * Gestiona operaciones CRUD sobre canciones
 */

const { Song } = require('../models');

/**
 * Obtener todas las canciones (con paginación)
 */
const getAllSongs = async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;

    let query = {};

    // Búsqueda por nombre, artista o álbum
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { artists: { $regex: search, $options: 'i' } },
        { album: { $regex: search, $options: 'i' } }
      ];
    }

    const songs = await Song.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Song.countDocuments(query);

    res.status(200).json({
      success: true,
      count: songs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
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
 * Obtener una canción por ID
 */
const getSongById = async (req, res) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Canción no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: song
    });
  } catch (error) {
    res.status(500).json({
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
    const songData = req.body;

    // Usar updateOne con upsert para evitar duplicados
    const result = await Song.updateOne(
      { _id: songData._id },
      { $set: songData },
      { upsert: true }
    );

    // Obtener la canción creada/actualizada
    const song = await Song.findById(songData._id);

    res.status(result.upsertedCount ? 201 : 200).json({
      success: true,
      created: !!result.upsertedCount,
      data: song
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
    const { songs } = req.body;

    if (!Array.isArray(songs)) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere un array de canciones'
      });
    }

    const savedSongs = [];
    const errors = [];

    for (const songData of songs) {
      try {
        await Song.updateOne(
          { _id: songData._id },
          { $set: songData },
          { upsert: true }
        );
        const song = await Song.findById(songData._id);
        savedSongs.push(song);
      } catch (error) {
        errors.push({
          id: songData._id,
          error: error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      saved: savedSongs.length,
      errors: errors.length,
      data: savedSongs,
      errorDetails: errors
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
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere un array de IDs'
      });
    }

    const songs = await Song.find({ _id: { $in: ids } });

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
    const { name, artist, album, limit = 50 } = req.query;

    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (artist) {
      query.artists = { $regex: artist, $options: 'i' };
    }

    if (album) {
      query.album = { $regex: album, $options: 'i' };
    }

    const songs = await Song.find(query).limit(parseInt(limit));

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

    const song = await Song.findByIdAndDelete(id);

    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Canción no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
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

