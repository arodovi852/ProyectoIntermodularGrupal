/**
 * Servicio de Canciones
 * Contiene toda la lógica de negocio relacionada con canciones
 */

const { Song } = require('../models');
const SongDTO = require('../dto/SongDTO');

class SongService {
  /**
   * Crear o actualizar una canción
   * @param {Object} songData - Datos de la canción
   * @returns {Object} Canción creada/actualizada
   */
  async createOrUpdateSong(songData) {
    try {
      // Validar y transformar datos
      const validatedData = SongDTO.toCreate(songData);

      // Usar updateOne con upsert para evitar duplicados
      const result = await Song.updateOne(
        { _id: validatedData._id },
        { $set: validatedData },
        { upsert: true }
      );

      // Obtener la canción creada/actualizada
      const song = await Song.findById(validatedData._id);

      return {
        song: SongDTO.toResponse(song),
        isNew: !!result.upsertedCount
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crear o actualizar múltiples canciones (batch)
   * @param {Array} songsData - Array de datos de canciones
   * @returns {Object} Resultado con canciones guardadas y errores
   */
  async createOrUpdateSongsBatch(songsData) {
    try {
      if (!Array.isArray(songsData)) {
        throw new Error('Se requiere un array de canciones');
      }

      const savedSongs = [];
      const errors = [];

      for (const songData of songsData) {
        try {
          const validatedData = SongDTO.toCreate(songData);

          await Song.updateOne(
            { _id: validatedData._id },
            { $set: validatedData },
            { upsert: true }
          );

          const song = await Song.findById(validatedData._id);
          savedSongs.push(SongDTO.toResponse(song));
        } catch (error) {
          errors.push({
            id: songData._id || 'unknown',
            error: error.message
          });
        }
      }

      return {
        saved: savedSongs,
        savedCount: savedSongs.length,
        errors,
        errorCount: errors.length
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Guardar canciones desde Spotify API
   * @param {Array} spotifyTracks - Array de tracks de Spotify
   * @returns {Object} Resultado con canciones guardadas
   */
  async saveFromSpotifyAPI(spotifyTracks) {
    try {
      // Transformar tracks de Spotify
      const { validTracks, errors: transformErrors } = SongDTO.fromSpotifyAPIBatch(spotifyTracks);

      // Guardar en la base de datos
      const result = await this.createOrUpdateSongsBatch(validTracks);

      return {
        ...result,
        transformErrors
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener canción por ID
   * @param {String} songId - ID de Spotify de la canción
   * @returns {Object} Canción encontrada
   */
  async getSongById(songId) {
    try {
      const song = await Song.findById(songId);

      if (!song) {
        throw new Error('Canción no encontrada');
      }

      return SongDTO.toDetailedResponse(song);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener múltiples canciones por IDs
   * @param {Array} songIds - Array de IDs
   * @returns {Array} Array de canciones
   */
  async getSongsByIds(songIds) {
    try {
      if (!Array.isArray(songIds)) {
        throw new Error('Se requiere un array de IDs');
      }

      const songs = await Song.find({ _id: { $in: songIds } });

      return SongDTO.toResponseBatch(songs);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener todas las canciones con paginación
   * @param {Object} options - Opciones de paginación y filtros
   * @returns {Object} Lista de canciones con metadatos
   */
  async getAllSongs(options = {}) {
    try {
      const page = parseInt(options.page) || 1;
      const limit = parseInt(options.limit) || 50;
      const skip = (page - 1) * limit;

      // Construir query de búsqueda
      const query = SongDTO.toSearchQuery({
        search: options.search,
        name: options.name,
        artist: options.artist,
        album: options.album
      });

      const songs = await Song.find(query)
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

      const total = await Song.countDocuments(query);

      return {
        songs: SongDTO.toResponseBatch(songs),
        pagination: {
          count: songs.length,
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar canciones
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Array} Array de canciones
   */
  async searchSongs(filters = {}) {
    try {
      const limit = parseInt(filters.limit) || 50;

      // Construir query
      const query = SongDTO.toSearchQuery(filters);

      const songs = await Song.find(query).limit(limit);

      return SongDTO.toResponseBatch(songs);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar canciones por nombre
   * @param {String} name - Nombre a buscar
   * @param {Number} limit - Límite de resultados
   * @returns {Array} Array de canciones
   */
  async searchByName(name, limit = 20) {
    try {
      const songs = await Song.find({
        name: { $regex: name, $options: 'i' }
      }).limit(limit);

      return SongDTO.toResponseBatch(songs);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar canciones por artista
   * @param {String} artist - Artista a buscar
   * @param {Number} limit - Límite de resultados
   * @returns {Array} Array de canciones
   */
  async searchByArtist(artist, limit = 20) {
    try {
      const songs = await Song.find({
        artists: { $regex: artist, $options: 'i' }
      }).limit(limit);

      return SongDTO.toResponseBatch(songs);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar canciones por álbum
   * @param {String} album - Álbum a buscar
   * @param {Number} limit - Límite de resultados
   * @returns {Array} Array de canciones
   */
  async searchByAlbum(album, limit = 20) {
    try {
      const songs = await Song.find({
        album: { $regex: album, $options: 'i' }
      }).limit(limit);

      return SongDTO.toResponseBatch(songs);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar una canción
   * @param {String} songId - ID de la canción
   * @returns {Boolean} true si se eliminó exitosamente
   */
  async deleteSong(songId) {
    try {
      const song = await Song.findByIdAndDelete(songId);

      if (!song) {
        throw new Error('Canción no encontrada');
      }

      // TODO: Eliminar la canción de todas las playlists que la contengan
      // const Playlist = require('../models').Playlist;
      // await Playlist.updateMany(
      //   { tracks: songId },
      //   { $pull: { tracks: songId } }
      // );

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar si una canción existe
   * @param {String} songId - ID de Spotify de la canción
   * @returns {Boolean} true si existe
   */
  async songExists(songId) {
    try {
      const song = await Song.findById(songId);
      return !!song;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener estadísticas de canciones
   * @returns {Object} Estadísticas
   */
  async getStats() {
    try {
      const total = await Song.countDocuments();

      // Artistas únicos
      const artistsResult = await Song.aggregate([
        { $unwind: '$artists' },
        { $group: { _id: '$artists' } },
        { $count: 'total' }
      ]);

      // Álbumes únicos
      const albumsResult = await Song.aggregate([
        { $group: { _id: '$album' } },
        { $count: 'total' }
      ]);

      // Duración total
      const durationResult = await Song.aggregate([
        { $group: { _id: null, totalDuration: { $sum: '$duration_ms' } } }
      ]);

      return {
        totalSongs: total,
        uniqueArtists: artistsResult[0]?.total || 0,
        uniqueAlbums: albumsResult[0]?.total || 0,
        totalDurationMs: durationResult[0]?.totalDuration || 0,
        totalDurationFormatted: this._formatDuration(durationResult[0]?.totalDuration || 0)
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener canciones más recientes
   * @param {Number} limit - Límite de resultados
   * @returns {Array} Array de canciones
   */
  async getRecentSongs(limit = 10) {
    try {
      const songs = await Song.find()
        .sort({ createdAt: -1 })
        .limit(limit);

      return SongDTO.toResponseBatch(songs);
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

module.exports = new SongService();

