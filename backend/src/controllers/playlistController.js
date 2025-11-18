/**
 * Ejemplo de controlador para Playlists
 * Demuestra cómo usar los modelos de Mongoose en los controladores
 */

const { Playlist, Song, User } = require('../models');

/**
 * Obtener todas las playlists de un usuario
 */
const getUserPlaylists = async (req, res) => {
  try {
    const { userId } = req.params;

    const playlists = await Playlist.findByUserId(userId);

    res.status(200).json({
      success: true,
      count: playlists.length,
      data: playlists
    });
  } catch (error) {
    res.status(500).json({
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
    const { name, tracks, userId, cover_image_url, spotify_url } = req.body;

    // Validar que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Crear la playlist
    const playlist = await Playlist.create({
      name,
      tracks: tracks || [],
      userId,
      cover_image_url,
      spotify_url
    });

    res.status(201).json({
      success: true,
      data: playlist
    });
  } catch (error) {
    res.status(400).json({
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

    // Obtener la playlist
    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        error: 'Playlist no encontrada'
      });
    }

    // Obtener las canciones
    const songs = await Song.find({ _id: { $in: playlist.tracks } });

    // Obtener duración total
    const totalDuration = await playlist.getTotalDuration();

    res.status(200).json({
      success: true,
      data: {
        ...playlist.toObject(),
        songs,
        totalDuration,
        trackCount: playlist.getTrackCount()
      }
    });
  } catch (error) {
    res.status(500).json({
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
    const updates = req.body;

    const playlist = await Playlist.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!playlist) {
      return res.status(404).json({
        success: false,
        error: 'Playlist no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: playlist
    });
  } catch (error) {
    res.status(400).json({
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

    const playlist = await Playlist.findByIdAndDelete(id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        error: 'Playlist no encontrada'
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

/**
 * Añadir canciones a una playlist
 */
const addTracksToPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { tracks } = req.body; // Array de IDs de canciones

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        error: 'Playlist no encontrada'
      });
    }

    // Añadir tracks sin duplicados
    playlist.tracks = [...new Set([...playlist.tracks, ...tracks])];

    await playlist.save();

    res.status(200).json({
      success: true,
      data: playlist
    });
  } catch (error) {
    res.status(400).json({
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

