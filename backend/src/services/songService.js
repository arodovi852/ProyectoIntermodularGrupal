/**
 * Servicio de Canciones.
 *
 * Contiene toda la lógica de negocio relacionada con canciones, incluyendo:
 * - Creación y actualización de canciones individuales y en lote
 * - Importación desde API de Spotify
 * - Búsqueda y obtención de canciones
 * - Listado paginado con filtros
 * - Búsquedas específicas por nombre, artista, álbum
 *
 * Las canciones se identifican por el ID de Spotify como clave primaria
 * para evitar duplicados. Este servicio utiliza upsert para crear o actualizar
 * canciones de forma segura.
 *
 * @module services/songService
 * @requires ../models
 * @requires ../dto/SongDTO
 * @singleton
 */

const { Song } = require('../models');
const SongDTO = require('../dto/SongDTO');

class SongService {
  /**
   * Crea o actualiza una canción individual en la base de datos.
   *
   * Utiliza upsert para evitar duplicados (basado en ID de Spotify).
   * Si la canción existe, la actualiza; si no, la crea.
   *
   * Proceso:
   * 1. Valida datos mediante SongDTO.toCreate()
   * 2. Realiza upsert usando updateOne con _id como clave
   * 3. Obtiene la canción del resultado
   * 4. Retorna canción formateada con indicador de si es nueva
   *
   * @async
   * @method createOrUpdateSong
   * @param {Object} songData - Datos de la canción
   * @param {string} songData._id - ID de Spotify (clave primaria)
   * @param {string} songData.name - Nombre de la canción
   * @param {string} songData.album - Nombre del álbum
   * @param {string} songData.album_image_url - URL de portada (HTTPS)
   * @param {string[]} songData.artists - Array de nombres de artistas
   * @param {string|null} songData.preview_url - URL de preview (opcional)
   * @param {number} songData.duration_ms - Duración en milisegundos
   * @param {string} songData.spotify_url - URL en Spotify
   * @returns {Promise<Object>} Objeto con canción formateada e indicador isNew
   * @throws {Error} Si datos son inválidos
   *
   * @example
   * const result = await songService.createOrUpdateSong({
   *   _id: 'spotify123',
   *   name: 'Song Name',
   *   album: 'Album Name',
   *   // ... resto de campos
   * });
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
   * Crea o actualiza múltiples canciones en operación por lotes.
   *
   * Procesa cada canción individualmente, permitiendo crear varias de forma
   * eficiente mientras reporta errores de las que fallan.
   *
   * Proceso:
   * 1. Valida que sea array
   * 2. Itera sobre cada canción
   * 3. Valida y upsert para cada una
   * 4. Retorna resumen con canciones guardadas y errores
   *
   * @async
   * @method createOrUpdateSongsBatch
   * @param {Object[]} songsData - Array de datos de canciones
   * @returns {Promise<Object>} Objeto con resultados del batch
   * @returns {Object[]} return.saved Array de canciones guardadas exitosamente
   * @returns {number} return.savedCount Cantidad de canciones guardadas
   * @returns {Object[]} return.errors Array de errores encontrados
   * @returns {number} return.errorCount Cantidad de errores
   * @throws {Error} Si songsData no es array
   *
   * @example
   * const result = await songService.createOrUpdateSongsBatch([
   *   { _id: '1', name: 'Song 1', ... },
   *   { _id: '2', name: 'Song 2', ... }
   * ]);
   * // { saved: [...], savedCount: 2, errors: [], errorCount: 0 }
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
   * Guarda canciones importadas desde la API de Spotify.
   *
   * Realiza dos pasos:
   * 1. Transforma tracks de Spotify usando SongDTO.fromSpotifyAPIBatch()
   * 2. Guarda las canciones válidas en la BD y reporta errores
   *
   * Útil para importar resultados de búsqueda o recomendaciones de Spotify.
   *
   * @async
   * @method saveFromSpotifyAPI
   * @param {Object[]} spotifyTracks - Array de tracks desde API de Spotify
   * @returns {Promise<Object>} Resultado con canciones guardadas, errores y transformErrors
   *
   * @example
   * const result = await songService.saveFromSpotifyAPI(spotifySearchResults);
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
   * Obtiene los detalles completos de una canción por su ID de Spotify.
   *
   * @async
   * @method getSongById
   * @param {string} songId - ID de Spotify de la canción
   * @returns {Promise<Object>} Canción con información detallada y metadatos
   * @throws {Error} Si canción no encontrada
   *
   * @example
   * const song = await songService.getSongById('3n3Ppam7vgaVa1iaRUc9Lp');
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
   * Obtiene múltiples canciones usando sus IDs de Spotify.
   *
   * @async
   * @method getSongsByIds
   * @param {string[]} songIds - Array de IDs de Spotify
   * @returns {Promise<Object[]>} Array de canciones encontradas
   * @throws {Error} Si songIds no es array
   *
   * @example
   * const songs = await songService.getSongsByIds(['id1', 'id2', 'id3']);
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
   * Obtiene todas las canciones con paginación y filtros opcionales.
   *
   * Soporta búsqueda multifield y paginación.
   *
   * @async
   * @method getAllSongs
   * @param {Object} [options={}] - Opciones de paginación y filtros
   * @param {number} [options.page=1] - Número de página
   * @param {number} [options.limit=50] - Canciones por página
   * @param {string} [options.search] - Búsqueda general (nombre, artista, álbum)
   * @param {string} [options.name] - Búsqueda en nombre
   * @param {string} [options.artist] - Búsqueda en artista
   * @param {string} [options.album] - Búsqueda en álbum
   * @returns {Promise<Object>} Objeto con canciones paginadas y metadatos
   *
   * @example
   * const result = await songService.getAllSongs({ page: 1, limit: 20 });
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
   * Busca canciones con múltiples criterios de filtrado.
   *
   * @async
   * @method searchSongs
   * @param {Object} [filters={}] - Filtros de búsqueda
   * @param {string} [filters.search] - Búsqueda general
   * @param {string} [filters.name] - Búsqueda en nombre
   * @param {string} [filters.artist] - Búsqueda en artista
   * @param {string} [filters.album] - Búsqueda en álbum
   * @param {number} [filters.limit=50] - Límite de resultados
   * @returns {Promise<Object[]>} Array de canciones que coinciden
   *
   * @example
   * const songs = await songService.searchSongs({ artist: 'Queen' });
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
   * Busca canciones específicamente por nombre.
   *
   * @async
   * @method searchByName
   * @param {string} name - Nombre de canción a buscar
   * @param {number} [limit=20] - Número máximo de resultados
   * @returns {Promise<Object[]>} Array de canciones que coinciden
   *
   * @example
   * const songs = await songService.searchByName('bohemian');
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
   * Busca canciones específicamente por nombre de artista.
   *
   * @async
   * @method searchByArtist
   * @param {string} artist - Nombre de artista a buscar
   * @param {number} [limit=20] - Número máximo de resultados
   * @returns {Promise<Object[]>} Array de canciones que coinciden
   *
   * @example
   * const songs = await songService.searchByArtist('Queen');
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
   * Busca canciones específicamente por nombre de álbum.
   *
   * @async
   * @method searchByAlbum
   * @param {string} album - Nombre de álbum a buscar
   * @param {number} [limit=20] - Número máximo de resultados
   * @returns {Promise<Object[]>} Array de canciones que coinciden
   *
   * @example
   * const songs = await songService.searchByAlbum('A Night at the Opera');
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

