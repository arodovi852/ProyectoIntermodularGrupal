/**
 * Servicio de Playlists.
 *
 * Contiene toda la lógica de negocio relacionada con playlists, incluyendo:
 * - Creación y actualización de playlists
 * - Gestión de canciones (añadir, eliminar, reordenar)
 * - Obtención de detalles con estadísticas
 * - Búsqueda y listado de playlists por usuario
 * - Duplicación de playlists
 * - Cálculo de duraciones y metadatos
 *
 * Este servicio valida referencias entre playlists, usuarios y canciones,
 * asegurando integridad referencial y aplicando reglas de negocio.
 *
 * @module services/playlistService
 * @requires ../models
 * @requires ../dto/PlaylistDTO
 * @requires ../dto/SongDTO
 * @singleton
 */

const { Playlist, Song, User } = require('../models');
const PlaylistDTO = require('../dto/PlaylistDTO');
const SongDTO = require('../dto/SongDTO');

class PlaylistService {
  /**
   * Crea una nueva playlist vacía con configuración de recomendaciones.
   *
   * Proceso:
   * 1. Valida datos mediante PlaylistDTO.toCreate()
   * 2. Verifica que el usuario existe
   * 3. Si hay tracks iniciales, verifica que existan en BD
   * 4. Crea la playlist
   * 5. Retorna playlist formateada
   *
   * @async
   * @method createPlaylist
   * @param {Object} playlistData - Datos de la nueva playlist
   * @param {string} playlistData.name - Nombre (1-200 caracteres)
   * @param {string} playlistData.userId - ID del usuario propietario
   * @param {Object} playlistData.config - Configuración de recomendaciones
   * @param {number} playlistData.config.size - Número de tracks (1-100)
   * @param {string[]} playlistData.config.seeds - Semillas (1-5)
   * @param {string[]} [playlistData.config.negativeSeeds] - Semillas negativas (0-5)
   * @param {string[]} [playlistData.tracks] - IDs de tracks iniciales (opcional)
   * @returns {Promise<Object>} Playlist creada
   * @throws {Error} Si usuario no existe, tracks inválidos, o datos inválidos
   *
   * @example
   * const playlist = await playlistService.createPlaylist({
   *   name: 'My Playlist',
   *   userId: '507f1f77bcf86cd799439011',
   *   config: { size: 30, seeds: ['track1', 'artist2'] }
   * });
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
   * Obtiene los datos básicos de una playlist.
   *
   * @async
   * @method getPlaylistById
   * @param {string} playlistId - ID de la playlist
   * @returns {Promise<Object>} Datos básicos de la playlist
   * @throws {Error} Si playlist no encontrada
   *
   * @example
   * const playlist = await playlistService.getPlaylistById(playlistId);
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
   * Obtiene los detalles completos de una playlist incluyendo todas sus canciones.
   *
   * Realiza múltiples operaciones:
   * 1. Obtiene la playlist
   * 2. Obtiene todas las canciones referenciadas
   * 3. Calcula la duración total
   * 4. Combina en respuesta detallada
   *
   * @async
   * @method getPlaylistDetails
   * @param {string} playlistId - ID de la playlist
   * @returns {Promise<Object>} Playlist con todas las canciones y metadatos
   * @throws {Error} Si playlist no encontrada
   *
   * @example
   * const details = await playlistService.getPlaylistDetails(playlistId);
   * // { id, name, songs: [...], totalDuration: '1h 45m', config: {...} }
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
   * Obtiene todas las playlists de un usuario específico.
   *
   * Soporta filtrado y búsqueda por nombre.
   * Las playlists se ordenan de más reciente a más antigua.
   *
   * @async
   * @method getUserPlaylists
   * @param {string} userId - ID del usuario propietario
   * @param {Object} [options={}] - Opciones de filtrado
   * @param {string} [options.search] - Búsqueda por nombre de playlist
   * @param {number} [options.page] - Página para paginación
   * @param {number} [options.limit] - Límite por página
   * @returns {Promise<Object[]>} Array de playlists del usuario
   * @throws {Error} Si usuario no encontrado
   *
   * @example
   * const userPlaylists = await playlistService.getUserPlaylists(userId);
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
   * Actualiza los datos de una playlist.
   *
   * Permite actualizar nombre, portada y configuración.
   * Si se actualizan los tracks, verifica que existan en BD.
   *
   * @async
   * @method updatePlaylist
   * @param {string} playlistId - ID de la playlist
   * @param {Object} updateData - Datos a actualizar
   * @param {string} [updateData.name] - Nuevo nombre
   * @param {string} [updateData.cover_image_url] - Nueva URL de portada
   * @param {Object} [updateData.config] - Nueva configuración
   * @param {string[]} [updateData.tracks] - Nuevo array de tracks
   * @returns {Promise<Object>} Playlist actualizada
   * @throws {Error} Si playlist no encontrada, tracks inválidos, o datos inválidos
   *
   * @example
   * const updated = await playlistService.updatePlaylist(playlistId, {
   *   name: 'Updated Name'
   * });
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
   * Añade una o más canciones a una playlist existente.
   *
   * Comportamiento:
   * 1. Valida IDs de canciones
   * 2. Verifica que todas las canciones existen en BD
   * 3. Evita añadir duplicados (si ya existe, no se añade)
   * 4. Añade al final de la playlist
   *
   * @async
   * @method addTracksToPlaylist
   * @param {string} playlistId - ID de la playlist
   * @param {Object} tracksData - Objeto con array de track IDs
   * @param {string[]} tracksData.tracks - Array de IDs de Spotify
   * @returns {Promise<Object>} Playlist actualizada
   * @throws {Error} Si playlist no encontrada, tracks inválidos, o todos ya existen
   *
   * @example
   * const updated = await playlistService.addTracksToPlaylist(playlistId, {
   *   tracks: ['id1', 'id2', 'id3']
   * });
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
   * Elimina una o más canciones de una playlist.
   *
   * @async
   * @method removeTracksFromPlaylist
   * @param {string} playlistId - ID de la playlist
   * @param {string[]} trackIds - Array de IDs de canciones a eliminar
   * @returns {Promise<Object>} Playlist actualizada
   * @throws {Error} Si playlist no encontrada o trackIds inválidos
   *
   * @example
   * const updated = await playlistService.removeTracksFromPlaylist(playlistId, ['id1', 'id2']);
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
   * Reordena las canciones en una playlist.
   *
   * Valida que el nuevo orden contenga exactamente los mismos tracks.
   * Permite reorganizar la playlist sin añadir ni eliminar canciones.
   *
   * @async
   * @method reorderTracks
   * @param {string} playlistId - ID de la playlist
   * @param {string[]} newOrder - Array con IDs en nuevo orden
   * @returns {Promise<Object>} Playlist con tracks reordenados
   * @throws {Error} Si playlist no encontrada, orden inválido, o faltan IDs
   *
   * @example
   * const updated = await playlistService.reorderTracks(playlistId, ['id3', 'id1', 'id2']);
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
   * Elimina permanentemente una playlist.
   *
   * Importante: La eliminación es PERMANENTE.
   * No elimina las canciones de la BD, solo la referencia.
   *
   * @async
   * @method deletePlaylist
   * @param {string} playlistId - ID de la playlist a eliminar
   * @returns {Promise<boolean>} true si se eliminó exitosamente
   * @throws {Error} Si playlist no encontrada
   *
   * @example
   * await playlistService.deletePlaylist(playlistId);
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
   * Duplica una playlist con un nuevo nombre.
   *
   * Crea una copia exacta de la playlist original con:
   * - Nuevo nombre (o mismo + " (copia)")
   * - Mismo usuario propietario
   * - Mismas canciones
   * - Misma configuración
   * - Nueva ID de documento
   *
   * @async
   * @method duplicatePlaylist
   * @param {string} playlistId - ID de la playlist a duplicar
   * @param {string} userId - ID del usuario propietario
   * @param {string} [newName] - Nombre opcional para la copia
   * @returns {Promise<Object>} Playlist duplicada
   * @throws {Error} Si playlist no encontrada
   *
   * @example
   * const copy = await playlistService.duplicatePlaylist(playlistId, userId, 'Mi Copia');
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
        spotify_url: null, // No copiar URL de Spotify
        config: originalPlaylist.config ? { ...originalPlaylist.config.toObject() } : null
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

