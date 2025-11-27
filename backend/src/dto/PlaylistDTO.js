/**
 * Data Transfer Object para Playlist
 * Transforma datos entre capas de la aplicación
 */

class PlaylistDTO {
  /**
   * Convierte datos de entrada (request) para crear playlist
   * @param {Object} data - Datos del request
   * @returns {Object} Datos validados para crear playlist
   */
  static toCreate(data) {
    const { name, userId, tracks, cover_image_url, spotify_url, config } = data;

    if (!name) {
      throw new Error('El nombre de la playlist es requerido');
    }

    if (!userId) {
      throw new Error('El ID del usuario es requerido');
    }

    if (!config) {
      throw new Error('La configuración de la playlist es requerida');
    }

    // Validar config básico
    if (!config.size || config.size < 1 || config.size > 100) {
      throw new Error('El tamaño debe estar entre 1 y 100');
    }

    if (!config.seeds || !Array.isArray(config.seeds) || config.seeds.length < 1 || config.seeds.length > 5) {
      throw new Error('Debe haber entre 1 y 5 semillas');
    }

    if (config.negativeSeeds && (!Array.isArray(config.negativeSeeds) || config.negativeSeeds.length > 5)) {
      throw new Error('Puede haber máximo 5 semillas negativas');
    }

    // Construir objeto config limpio con solo los valores presentes
    const cleanConfig = {
      size: config.size,
      seeds: config.seeds,
      negativeSeeds: config.negativeSeeds || []
    };

    // Añadir parámetros opcionales solo si están presentes
    const optionalParams = [
      'acousticness', 'danceability', 'energy', 'instrumentalness',
      'key', 'liveness', 'loudness', 'mode', 'speechiness', 'tempo', 'valence'
    ];

    optionalParams.forEach(param => {
      if (config[param] !== undefined && config[param] !== null) {
        cleanConfig[param] = config[param];
      }
    });

    return {
      name: name.trim(),
      userId,
      tracks: Array.isArray(tracks) ? tracks : [],
      cover_image_url: cover_image_url || 'https://via.placeholder.com/640x640.png?text=Playlist',
      spotify_url: spotify_url || null,
      config: cleanConfig
    };
  }

  /**
   * Convierte datos de entrada para actualización
   * @param {Object} data - Datos del request
   * @returns {Object} Datos validados para actualizar
   */
  static toUpdate(data) {
    const updates = {};

    if (data.name !== undefined) {
      updates.name = data.name.trim();
    }

    if (data.tracks !== undefined) {
      if (!Array.isArray(data.tracks)) {
        throw new Error('Tracks debe ser un array');
      }
      updates.tracks = data.tracks;
    }

    if (data.cover_image_url !== undefined) {
      updates.cover_image_url = data.cover_image_url;
    }

    if (data.spotify_url !== undefined) {
      updates.spotify_url = data.spotify_url;
    }

    if (data.config !== undefined) {
      // Validar config si se proporciona
      if (data.config.size && (data.config.size < 1 || data.config.size > 100)) {
        throw new Error('El tamaño debe estar entre 1 y 100');
      }

      if (data.config.seeds && (!Array.isArray(data.config.seeds) || data.config.seeds.length < 1 || data.config.seeds.length > 5)) {
        throw new Error('Debe haber entre 1 y 5 semillas');
      }

      if (data.config.negativeSeeds && (!Array.isArray(data.config.negativeSeeds) || data.config.negativeSeeds.length > 5)) {
        throw new Error('Puede haber máximo 5 semillas negativas');
      }

      updates.config = data.config;
    }

    return updates;
  }

  /**
   * Convierte modelo Playlist a respuesta básica
   * @param {Object} playlist - Documento de Playlist (Mongoose)
   * @returns {Object} Playlist formateado para respuesta
   */
  static toResponse(playlist) {
    if (!playlist) return null;

    return {
      id: playlist._id,
      name: playlist.name,
      tracks: playlist.tracks || [],
      trackCount: playlist.tracks?.length || 0,
      userId: playlist.userId,
      coverImageUrl: playlist.cover_image_url,
      spotifyUrl: playlist.spotify_url,
      config: playlist.config || null,
      createdAt: playlist.created_at || playlist.createdAt,
      updatedAt: playlist.updatedAt
    };
  }

  /**
   * Convierte múltiples playlists a respuesta
   * @param {Array} playlists - Array de documentos Playlist
   * @returns {Array} Array de playlists formateados
   */
  static toResponseBatch(playlists) {
    if (!Array.isArray(playlists)) return [];
    return playlists.map(playlist => this.toResponse(playlist));
  }

  /**
   * Convierte playlist con canciones completas (respuesta detallada)
   * @param {Object} playlist - Documento de Playlist
   * @param {Array} songs - Array de documentos Song
   * @param {String} totalDuration - Duración total formateada
   * @returns {Object} Playlist con información completa
   */
  static toDetailedResponse(playlist, songs = [], totalDuration = null) {
    if (!playlist) return null;

    const basic = this.toResponse(playlist);

    return {
      ...basic,
      songs: songs.map(song => ({
        id: song._id,
        name: song.name,
        album: song.album,
        albumImageUrl: song.album_image_url,
        artists: song.artists,
        previewUrl: song.preview_url,
        duration: song.getFormattedDuration ? song.getFormattedDuration() : null,
        durationMs: song.duration_ms,
        spotifyUrl: song.spotify_url
      })),
      totalDuration: totalDuration,
      metadata: {
        trackCount: playlist.tracks?.length || 0,
        hasSpotifyUrl: !!playlist.spotify_url,
        hasCustomCover: playlist.cover_image_url !== 'https://via.placeholder.com/640x640.png?text=Playlist'
      }
    };
  }

  /**
   * Valida datos para añadir tracks
   * @param {Object} data - Datos con tracks a añadir
   * @returns {Array} Array de track IDs validados
   */
  static toAddTracks(data) {
    const { tracks } = data;

    if (!tracks || !Array.isArray(tracks)) {
      throw new Error('Se requiere un array de IDs de tracks');
    }

    if (tracks.length === 0) {
      throw new Error('El array de tracks no puede estar vacío');
    }

    // Filtrar valores inválidos
    const validTracks = tracks.filter(id => id && typeof id === 'string');

    if (validTracks.length === 0) {
      throw new Error('No hay IDs de tracks válidos');
    }

    return validTracks;
  }

  /**
   * Convierte playlist a formato de exportación
   * @param {Object} playlist - Documento de Playlist
   * @param {Array} songs - Array de documentos Song
   * @returns {Object} Playlist en formato de exportación
   */
  static toExport(playlist, songs = []) {
    if (!playlist) return null;

    return {
      name: playlist.name,
      description: `Playlist creada en PlayTheMood`,
      trackCount: playlist.tracks?.length || 0,
      createdAt: playlist.created_at || playlist.createdAt,
      tracks: songs.map(song => ({
        name: song.name,
        artist: song.artists.join(', '),
        album: song.album,
        duration: song.getFormattedDuration ? song.getFormattedDuration() : null,
        spotifyUrl: song.spotify_url
      }))
    };
  }

  /**
   * Prepara query de búsqueda por usuario
   * @param {String} userId - ID del usuario
   * @param {Object} filters - Filtros adicionales
   * @returns {Object} Query de MongoDB
   */
  static toUserQuery(userId, filters = {}) {
    const query = { userId };

    if (filters.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }

    return query;
  }

  /**
   * Convierte respuesta con estadísticas
   * @param {Object} playlist - Documento de Playlist
   * @param {Object} stats - Estadísticas adicionales
   * @returns {Object} Playlist con estadísticas
   */
  static toResponseWithStats(playlist, stats = {}) {
    if (!playlist) return null;

    const basic = this.toResponse(playlist);

    return {
      ...basic,
      stats: {
        trackCount: playlist.tracks?.length || 0,
        totalDuration: stats.totalDuration || '0s',
        averageDuration: stats.averageDuration || '0s',
        uniqueArtists: stats.uniqueArtists || 0,
        uniqueAlbums: stats.uniqueAlbums || 0
      }
    };
  }
}

module.exports = PlaylistDTO;

