/**
 * Data Transfer Object para Playlist.
 *
 * Centraliza la validación y transformación de datos relacionados con playlists
 * entre las distintas capas de la aplicación (controladores, servicios y modelos).
 *
 * Responsabilidades principales:
 * - Validar y sanear los datos de entrada al crear o actualizar playlists.
 * - Formatear documentos de Mongoose a respuestas JSON consistentes.
 * - Construir estructuras específicas para respuestas detalladas, exportaciones
 *   y consultas filtradas por usuario.
 *
 * @class PlaylistDTO
 */

class PlaylistDTO {
    /**
   * Convierte datos de entrada (request) en un objeto válido para crear una playlist.
   *
   * Valida campos obligatorios (`name`, `userId`, `config`) y comprueba
   * reglas básicas de negocio sobre la configuración de generación:
   * - `config.size` entre 1 y 100.
   * - `config.seeds` entre 1 y 5 elementos.
   * - `config.negativeSeeds` máximo 5 elementos.
   *
   * También construye un objeto `config` limpio solo con los parámetros presentes
   * y normaliza valores por defecto para `tracks`, `cover_image_url` y `spotify_url`.
   *
   * @static
   * @param {Object} data Datos de la petición para crear la playlist.
   * @param {string} data.name Nombre de la playlist.
   * @param {string} data.userId ID del usuario propietario.
   * @param {string[]=} data.tracks IDs de canciones iniciales.
   * @param {string=} data.cover_image_url URL de la imagen de portada.
   * @param {string|null=} data.spotify_url URL asociada en Spotify.
   * @param {Object} data.config Configuración de generación de la playlist.
   * @returns {Object} Objeto listo para ser utilizado por la capa de persistencia.
   * @throws {Error} Si falta algún campo obligatorio o la configuración no es válida.
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
   * Convierte datos de entrada en un objeto de actualización parcial de playlist.
   *
   * Solo incluye en el resultado los campos presentes en `data`. Si se recibe
   * una propiedad `config`, valida de nuevo las reglas básicas (tamaño y semillas).
   *
   * @static
   * @param {Object} data Datos de la petición para actualizar la playlist.
   * @param {string=} data.name Nombre de la playlist.
   * @param {string[]=} data.tracks Nuevos IDs de canciones.
   * @param {string=} data.cover_image_url Nueva URL de portada.
   * @param {string|null=} data.spotify_url Nueva URL de Spotify.
   * @param {Object=} data.config Configuración actualizada de la playlist.
   * @returns {Object} Objeto con solo los campos a actualizar.
   * @throws {Error} Si `tracks` no es un array o la configuración no es válida.
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
   * Convierte un documento de Playlist (Mongoose) en una respuesta básica.
   *
   * Transforma el formato interno de base de datos al formato JSON normalizado
   * que se envía al cliente. Incluye:
   * - Cambio de nombres de propiedades (snake_case a camelCase).
   * - Conversión de `_id` a `id`.
   * - Conteo de tracks.
   * - Configuración asociada a la playlist.
   * - Timestamps de creación y actualización.
   *
   * @static
   * @param {Object|null} playlist Documento de Playlist (Mongoose) o `null`.
   * @returns {Object|null} Objeto plano listo para enviar al cliente, o `null` si no hay playlist.
   *
   * @example
   * const response = PlaylistDTO.toResponse(playlistDocument);
   * // { id: '..', name: 'My Playlist', trackCount: 5, ... }
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
   * Convierte un array de documentos Playlist en un array de respuestas básicas.
   *
   * Utiliza {@link toResponse} para procesar cada playlist del array.
   * Si el parámetro no es un array válido, devuelve un array vacío.
   *
   * @static
   * @param {Object[]} playlists Array de documentos Playlist (Mongoose).
   * @returns {Object[]} Array de playlists formateadas, o array vacío si la entrada es inválida.
   */
  static toResponseBatch(playlists) {
    if (!Array.isArray(playlists)) return [];
    return playlists.map(playlist => this.toResponse(playlist));
  }

  /**
   * Convierte una playlist y sus canciones asociadas en una respuesta detallada.
   *
   * Extiende la respuesta básica con:
   * - Lista completa de canciones con todos sus metadatos formateados.
   * - Duración total de la playlist (calculada externamente).
   * - Metadatos adicionales como disponibilidad de URL de Spotify y si usa portada personalizada.
   *
   * Útil para vistas detalladas que muestran todas las canciones y estadísticas.
   *
   * @static
   * @param {Object|null} playlist Documento de Playlist (Mongoose).
   * @param {Object[]} [songs=[]] Array de documentos Song relacionados.
   * @param {string|null} [totalDuration=null] Duración total formateada (por ejemplo "1h 23m").
   * @returns {Object|null} Objeto con información completa de la playlist y canciones, o `null` si no existe.
   *
   * @example
   * const detailed = PlaylistDTO.toDetailedResponse(playlist, songs, '45m 30s');
   * // { ...basic properties, songs: [...], totalDuration: '45m 30s', metadata: {...} }
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
   * Valida datos para añadir pistas a una playlist y devuelve solo los IDs válidos.
   *
   * Realiza validaciones de seguridad:
   * - Comprueba que `tracks` sea un array no vacío.
   * - Filtra valores inválidos (null, undefined, no strings).
   * - Lanza error si después de filtrar no hay IDs válidos.
   *
   * @static
   * @param {Object} data Datos de la petición con los tracks a añadir.
   * @param {string[]} data.tracks Array de IDs de tracks.
   * @returns {string[]} Array de IDs de tracks válidos y filtrados.
   * @throws {Error} Si no se recibe un array válido, está vacío, o no contiene IDs válidos.
   *
   * @example
   * const validIds = PlaylistDTO.toAddTracks({ tracks: ['1', '2', null, '3'] });
   * // ['1', '2', '3']
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
   * Convierte una playlist y sus canciones al formato de exportación.
   *
   * Prepara los datos en un formato legible y estructurado para exportar
   * (por ejemplo a JSON, CSV o para compartir). Incluye:
   * - Nombre e información descriptiva de la playlist.
   * - Número total de pistas.
   * - Lista de canciones con nombre, artistas, álbum, duración y URL de Spotify.
   * - Timestamp de creación.
   *
   * @static
   * @param {Object|null} playlist Documento de Playlist (Mongoose).
   * @param {Object[]} [songs=[]] Array de documentos Song relacionados.
   * @returns {Object|null} Objeto en formato de exportación, o `null` si no existe playlist.
   *
   * @example
   * const exported = PlaylistDTO.toExport(playlist, songs);
   * // { name: 'My Playlist', description: '...', tracks: [...] }
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
   * Prepara una query de MongoDB para búsqueda de playlists filtradas por usuario.
   *
   * Construye un objeto de query que filtra por propietario (userId) y opcionalmente
   * por nombre con búsqueda regex (case-insensitive).
   *
   * @static
   * @param {string} userId ID del usuario propietario de las playlists.
   * @param {Object} [filters={}] Filtros adicionales opcionales.
   * @param {string} [filters.search] Término de búsqueda en el nombre de la playlist.
   * @returns {Object} Query de MongoDB lista para usar con `.find()`.
   *
   * @example
   * const query = PlaylistDTO.toUserQuery(userId, { search: 'summer' });
   * const playlists = await Playlist.find(query);
   */
  static toUserQuery(userId, filters = {}) {
    const query = { userId };

    if (filters.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }

    return query;
  }

  /**
   * Combina la respuesta básica de playlist con estadísticas calculadas.
   *
   * Extiende la respuesta básica con un objeto `stats` que incluye:
   * - Número total de tracks.
   * - Duración total formateada de la playlist.
   * - Duración media por track formateada.
   * - Número de artistas únicos en la playlist.
   * - Número de álbumes únicos en la playlist.
   *
   * Útil para dashboards y vistas que muestren análisis de la playlist.
   *
   * @static
   * @param {Object|null} playlist Documento de Playlist (Mongoose).
   * @param {Object} [stats={}] Estadísticas adicionales calculadas.
   * @param {string} [stats.totalDuration] Duración total formateada (por ejemplo "45m 30s").
   * @param {string} [stats.averageDuration] Duración media formateada.
   * @param {number} [stats.uniqueArtists] Número de artistas únicos.
   * @param {number} [stats.uniqueAlbums] Número de álbumes únicos.
   * @returns {Object|null} Playlist con estadísticas o `null` si no existe.
   *
   * @example
   * const withStats = PlaylistDTO.toResponseWithStats(playlist, {
   *   totalDuration: '2h 15m',
   *   averageDuration: '3m 45s',
   *   uniqueArtists: 42,
   *   uniqueAlbums: 35
   * });
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

