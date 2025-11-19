/**
 * Servicio de Playlists
 * Contiene toda la lógica de negocio relacionada con playlists
 */

const { Playlist, Song, User } = require('../models');
const PlaylistDTO = require('../dto/PlaylistDTO');
const SongDTO = require('../dto/SongDTO');

class PlaylistService {
  /**
   * Crear una nueva playlist
   * @param {Object} playlistData - Datos de la playlist
   * @returns {Object} Playlist creada
   */
  async createPlaylist(playlistData) {
    try {
      // Validar y transformar datos
      const validatedData = PlaylistDTO.toCreate(playlistData);

      // Verificar que el usuario existe
      const user = await User.findById(validatedData.userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar que las canciones existen (si se proporcionaron)
      if (validatedData.tracks.length > 0) {
        const existingSongs = await Song.find({
          _id: { $in: validatedData.tracks }
        });

        if (existingSongs.length !== validatedData.tracks.length) {
          throw new Error('Una o más canciones no existen en la base de datos');
        }
      }

      // Crear la playlist
      const playlist = await Playlist.create(validatedData);

      return PlaylistDTO.toResponse(playlist);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener playlist por ID
   * @param {String} playlistId - ID de la playlist
   * @returns {Object} Playlist encontrada
   */
  async getPlaylistById(playlistId) {
    try {
      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
        throw new Error('Playlist no encontrada');
      }

      return PlaylistDTO.toResponse(playlist);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener detalles completos de una playlist (con canciones)
   * @param {String} playlistId - ID de la playlist
   * @returns {Object} Playlist con canciones completas
   */
  async getPlaylistDetails(playlistId) {
    try {
      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
        throw new Error('Playlist no encontrada');
      }

      // Obtener las canciones
      const songs = await Song.find({ _id: { $in: playlist.tracks } });

      // Calcular duración total
      const totalDuration = await playlist.getTotalDuration();

      return PlaylistDTO.toDetailedResponse(playlist, songs, totalDuration);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener todas las playlists de un usuario
   * @param {String} userId - ID del usuario
   * @param {Object} options - Opciones de filtrado
   * @returns {Array} Array de playlists
   */
  async getUserPlaylists(userId, options = {}) {
    try {
      // Verificar que el usuario existe
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Construir query
      const query = PlaylistDTO.toUserQuery(userId, options);

      const playlists = await Playlist.find(query).sort({ created_at: -1 });

      return PlaylistDTO.toResponseBatch(playlists);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar una playlist
   * @param {String} playlistId - ID de la playlist
   * @param {Object} updateData - Datos a actualizar
   * @returns {Object} Playlist actualizada
   */
  async updatePlaylist(playlistId, updateData) {
    try {
      // Validar y transformar datos
      const validatedUpdates = PlaylistDTO.toUpdate(updateData);

      // Si se actualizan los tracks, verificar que existan
      if (validatedUpdates.tracks) {
        const existingSongs = await Song.find({
          _id: { $in: validatedUpdates.tracks }
        });

        if (existingSongs.length !== validatedUpdates.tracks.length) {
          throw new Error('Una o más canciones no existen en la base de datos');
        }
      }

      const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        validatedUpdates,
        { new: true, runValidators: true }
      );

      if (!playlist) {
        throw new Error('Playlist no encontrada');
      }

      return PlaylistDTO.toResponse(playlist);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Añadir canciones a una playlist
   * @param {String} playlistId - ID de la playlist
   * @param {Object} tracksData - Datos con IDs de canciones
   * @returns {Object} Playlist actualizada
   */
  async addTracksToPlaylist(playlistId, tracksData) {
    try {
      // Validar tracks
      const validTracks = PlaylistDTO.toAddTracks(tracksData);

      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
        throw new Error('Playlist no encontrada');
      }

      // Verificar que las canciones existen
      const existingSongs = await Song.find({ _id: { $in: validTracks } });

      if (existingSongs.length !== validTracks.length) {
        throw new Error('Una o más canciones no existen en la base de datos');
      }

      // Añadir tracks sin duplicados
      const existingTracks = new Set(playlist.tracks.map(id => id.toString()));
      const newTracks = validTracks.filter(id => !existingTracks.has(id));

      if (newTracks.length === 0) {
        throw new Error('Todas las canciones ya están en la playlist');
      }

      playlist.tracks = [...playlist.tracks, ...newTracks];
      await playlist.save();

      return PlaylistDTO.toResponse(playlist);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar canciones de una playlist
   * @param {String} playlistId - ID de la playlist
   * @param {Array} trackIds - IDs de canciones a eliminar
   * @returns {Object} Playlist actualizada
   */
  async removeTracksFromPlaylist(playlistId, trackIds) {
    try {
      if (!Array.isArray(trackIds) || trackIds.length === 0) {
        throw new Error('Se requiere un array de IDs de tracks');
      }

      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
        throw new Error('Playlist no encontrada');
      }

      // Filtrar los tracks a eliminar
      playlist.tracks = playlist.tracks.filter(
        id => !trackIds.includes(id.toString())
      );

      await playlist.save();

      return PlaylistDTO.toResponse(playlist);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reordenar canciones en una playlist
   * @param {String} playlistId - ID de la playlist
   * @param {Array} newOrder - Nuevo orden de IDs
   * @returns {Object} Playlist actualizada
   */
  async reorderTracks(playlistId, newOrder) {
    try {
      if (!Array.isArray(newOrder)) {
        throw new Error('Se requiere un array con el nuevo orden');
      }

      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
        throw new Error('Playlist no encontrada');
      }

      // Verificar que todos los IDs sean válidos
      const currentTracksSet = new Set(playlist.tracks.map(id => id.toString()));
      const newOrderSet = new Set(newOrder);

      if (currentTracksSet.size !== newOrderSet.size) {
        throw new Error('El nuevo orden debe contener todos los tracks actuales');
      }

      for (const id of newOrder) {
        if (!currentTracksSet.has(id.toString())) {
          throw new Error('El nuevo orden contiene IDs inválidos');
        }
      }

      playlist.tracks = newOrder;
      await playlist.save();

      return PlaylistDTO.toResponse(playlist);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar una playlist
   * @param {String} playlistId - ID de la playlist
   * @returns {Boolean} true si se eliminó exitosamente
   */
  async deletePlaylist(playlistId) {
    try {
      const playlist = await Playlist.findByIdAndDelete(playlistId);

      if (!playlist) {
        throw new Error('Playlist no encontrada');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Duplicar una playlist
   * @param {String} playlistId - ID de la playlist a duplicar
   * @param {String} userId - ID del usuario propietario
   * @param {String} newName - Nombre opcional para la nueva playlist
   * @returns {Object} Playlist duplicada
   */
  async duplicatePlaylist(playlistId, userId, newName = null) {
    try {
      const originalPlaylist = await Playlist.findById(playlistId);

      if (!originalPlaylist) {
        throw new Error('Playlist no encontrada');
      }

      // Crear nueva playlist con los datos de la original
      const newPlaylistData = {
        name: newName || `${originalPlaylist.name} (copia)`,
        userId,
        tracks: [...originalPlaylist.tracks],
        cover_image_url: originalPlaylist.cover_image_url,
        spotify_url: null // No copiar URL de Spotify
      };

      const newPlaylist = await this.createPlaylist(newPlaylistData);

      return newPlaylist;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener estadísticas de una playlist
   * @param {String} playlistId - ID de la playlist
   * @returns {Object} Estadísticas
   */
  async getPlaylistStats(playlistId) {
    try {
      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
        throw new Error('Playlist no encontrada');
      }

      const songs = await Song.find({ _id: { $in: playlist.tracks } });

      // Calcular estadísticas
      const totalDurationMs = songs.reduce((sum, song) => sum + song.duration_ms, 0);
      const uniqueArtists = new Set(songs.flatMap(song => song.artists)).size;
      const uniqueAlbums = new Set(songs.map(song => song.album)).size;

      const stats = {
        totalDuration: this._formatDuration(totalDurationMs),
        averageDuration: this._formatDuration(totalDurationMs / songs.length || 0),
        uniqueArtists,
        uniqueAlbums
      };

      return PlaylistDTO.toResponseWithStats(playlist, stats);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Exportar playlist
   * @param {String} playlistId - ID de la playlist
   * @returns {Object} Playlist en formato de exportación
   */
  async exportPlaylist(playlistId) {
    try {
      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
        throw new Error('Playlist no encontrada');
      }

      const songs = await Song.find({ _id: { $in: playlist.tracks } });

      return PlaylistDTO.toExport(playlist, songs);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar playlists por nombre
   * @param {String} searchTerm - Término de búsqueda
   * @param {Object} options - Opciones de búsqueda
   * @returns {Array} Array de playlists
   */
  async searchPlaylists(searchTerm, options = {}) {
    try {
      const limit = parseInt(options.limit) || 50;
      const userId = options.userId;

      const query = {
        name: { $regex: searchTerm, $options: 'i' }
      };

      // Si se especifica usuario, filtrar por él
      if (userId) {
        query.userId = userId;
      }

      const playlists = await Playlist.find(query)
        .limit(limit)
        .sort({ created_at: -1 });

      return PlaylistDTO.toResponseBatch(playlists);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener playlists más recientes
   * @param {Number} limit - Límite de resultados
   * @returns {Array} Array de playlists
   */
  async getRecentPlaylists(limit = 10) {
    try {
      const playlists = await Playlist.find()
        .sort({ created_at: -1 })
        .limit(limit);

      return PlaylistDTO.toResponseBatch(playlists);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar si un usuario es propietario de una playlist
   * @param {String} playlistId - ID de la playlist
   * @param {String} userId - ID del usuario
   * @returns {Boolean} true si es propietario
   */
  async isOwner(playlistId, userId) {
    try {
      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
        throw new Error('Playlist no encontrada');
      }

      return playlist.userId.toString() === userId.toString();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Formatear duración (helper privado)
   * @param {Number} durationMs - Duración en milisegundos
   * @returns {String} Duración formateada
   */
  _formatDuration(durationMs) {
    const hours = Math.floor(durationMs / 3600000);
    const minutes = Math.floor((durationMs % 3600000) / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }
}

module.exports = new PlaylistService();

