/**
 * Data Transfer Object para Song.
 *
 * Centraliza la validación y transformación de datos relacionados con canciones
 * entre las distintas capas de la aplicación (controladores, servicios y modelos).
 *
 * Responsabilidades principales:
 * - Convertir tracks de la API de Spotify al formato de base de datos.
 * - Validar y sanear datos de entrada para crear canciones.
 * - Formatear documentos de Mongoose a respuestas JSON consistentes.
 * - Construir queries de búsqueda filtradas por nombre, artista, álbum, etc.
 *
 * @class SongDTO
 */

const { isValidSpotifyTrack, getBestAlbumImage } = require('../utils/spotifyHelper');

class SongDTO {
  /**
   * Convierte un track de la API de Spotify al formato interno de la base de datos.
   *
   * Realiza las siguientes transformaciones:
   * - Extrae el ID del track de Spotify como `_id`.
   * - Obtiene la mejor imagen de álbum disponible (prioriza tamaño grande).
   * - Extrae nombres de artistas en un array.
   * - Normaliza URL de preview (puede ser `null` si no está disponible).
   * - Mapea propiedades de Spotify al esquema interno.
   *
   * @static
   * @param {Object} spotifyTrack Objeto de track desde la API de Spotify.
   * @param {string} spotifyTrack.id ID único del track en Spotify.
   * @param {string} spotifyTrack.name Nombre del track.
   * @param {Object} spotifyTrack.album Objeto de álbum con imágenes.
   * @param {Array} spotifyTrack.artists Array de objetos artista.
   * @param {string|null} spotifyTrack.preview_url URL de preview de 30 segundos.
   * @param {number} spotifyTrack.duration_ms Duración en milisegundos.
   * @param {Object} spotifyTrack.external_urls URLs externas incluida la de Spotify.
   * @returns {Object} Objeto track en formato de base de datos.
   * @throws {Error} Si la estructura del track no es válida.
   *
   * @example
   * const spotifyTrack = { id: '..', name: 'Song', ... };
   * const dbTrack = SongDTO.fromSpotifyAPI(spotifyTrack);
   */
  static fromSpotifyAPI(spotifyTrack) {
    // Validar estructura
    if (!isValidSpotifyTrack(spotifyTrack)) {
      throw new Error('Estructura de track de Spotify inválida');
    }

    return {
      _id: spotifyTrack.id,
      name: spotifyTrack.name,
      album: spotifyTrack.album.name,
      album_image_url: getBestAlbumImage(spotifyTrack.album.images, 'large'),
      artists: spotifyTrack.artists.map(artist => artist.name),
      preview_url: spotifyTrack.preview_url || null,
      duration_ms: spotifyTrack.duration_ms,
      spotify_url: spotifyTrack.external_urls.spotify
    };
  }

  /**
   * Convierte múltiples tracks de la API de Spotify al formato interno de forma segura.
   *
   * Procesa un array de tracks de Spotify, validando cada uno de forma individual.
   * Los tracks inválidos se descartan, pero se registran sus errores para información.
   * Este método nunca lanza excepciones; devuelve un objeto con dos propiedades:
   * - `validTracks`: Array de tracks válidos convertidos.
   * - `errors`: Array de errores de conversión con índice y descripción.
   *
   * @static
   * @param {Array} spotifyTracks Array de objetos track desde la API de Spotify.
   * @returns {Object} Objeto con propiedades `validTracks` y `errors`.
   * @returns {Object[]} return.validTracks Array de tracks válidos convertidos.
   * @returns {Object[]} return.errors Array de objetos con propiedades `index` y `error`.
   * @throws {Error} Si el parámetro no es un array.
   *
   * @example
   * const result = SongDTO.fromSpotifyAPIBatch(spotifyTracks);
   * console.log(`Importados: ${result.validTracks.length}, Errores: ${result.errors.length}`);
   */
  static fromSpotifyAPIBatch(spotifyTracks) {
    if (!Array.isArray(spotifyTracks)) {
      throw new Error('Se esperaba un array de tracks');
    }

    const validTracks = [];
    const errors = [];

    spotifyTracks.forEach((track, index) => {
      try {
        if (isValidSpotifyTrack(track)) {
          validTracks.push(this.fromSpotifyAPI(track));
        } else {
          errors.push({ index, error: 'Track inválido' });
        }
      } catch (error) {
        errors.push({ index, error: error.message });
      }
    });

    return { validTracks, errors };
  }

  /**
   * Convierte datos de entrada (request) en un objeto válido para crear una canción.
   *
   * Valida todos los campos obligatorios y aplica reglas de negocio:
   * - `_id` (ID de Spotify) es requerido.
   * - `name` y `album` deben estar presentes y se triman espacios.
   * - Se requiere al menos un artista en el array `artists`.
   * - `duration_ms` debe ser un número no negativo.
   * - `album_image_url` y `spotify_url` son requeridas.
   * - `preview_url` es opcional y puede ser `null`.
   *
   * @static
   * @param {Object} data Datos de la petición para crear la canción.
   * @param {string} data._id ID único en Spotify.
   * @param {string} data.name Nombre de la canción.
   * @param {string} data.album Nombre del álbum.
   * @param {string} data.album_image_url URL de la portada del álbum.
   * @param {string[]} data.artists Array de nombres de artistas (mínimo 1).
   * @param {string|null} [data.preview_url] URL de preview de 30 segundos (opcional).
   * @param {number} data.duration_ms Duración en milisegundos.
   * @param {string} data.spotify_url URL del track en Spotify.
   * @returns {Object} Objeto listo para ser utilizado por la capa de persistencia.
   * @throws {Error} Si falta algún campo requerido o los datos no cumplen las reglas de validación.
   */
  static toCreate(data) {
    const {
      _id,
      name,
      album,
      album_image_url,
      artists,
      preview_url,
      duration_ms,
      spotify_url
    } = data;

    // Validaciones básicas
    if (!_id) throw new Error('El ID de Spotify es requerido');
    if (!name) throw new Error('El nombre de la canción es requerido');
    if (!album) throw new Error('El álbum es requerido');
    if (!album_image_url) throw new Error('La URL de la portada es requerida');
    if (!artists || !Array.isArray(artists) || artists.length === 0) {
      throw new Error('Se requiere al menos un artista');
    }
    if (!duration_ms || duration_ms < 0) throw new Error('Duración inválida');
    if (!spotify_url) throw new Error('La URL de Spotify es requerida');

    return {
      _id,
      name: name.trim(),
      album: album.trim(),
      album_image_url,
      artists,
      preview_url: preview_url || null,
      duration_ms,
      spotify_url
    };
  }

  /**
   * Convierte un documento de Song (Mongoose) en una respuesta básica.
   *
   * Transforma el formato interno de base de datos al formato JSON normalizado
   * que se envía al cliente. Incluye:
   * - Cambio de nombres de propiedades (snake_case a camelCase).
   * - Conversión de `_id` a `id`.
   * - Cálculo de duración formateada si el modelo incluye el método `getFormattedDuration()`.
   * - Timestamps de creación y actualización.
   *
   * @static
   * @param {Object|null} song Documento de Song (Mongoose) o `null`.
   * @returns {Object|null} Objeto plano listo para enviar al cliente, o `null` si no hay canción.
   *
   * @example
   * const response = SongDTO.toResponse(songDocument);
   * // { id: '..', name: 'Song', albumImageUrl: '..', ...}
   */
  static toResponse(song) {
    if (!song) return null;

    return {
      id: song._id,
      name: song.name,
      album: song.album,
      albumImageUrl: song.album_image_url,
      artists: song.artists,
      previewUrl: song.preview_url,
      duration: song.getFormattedDuration ? song.getFormattedDuration() : null,
      durationMs: song.duration_ms,
      spotifyUrl: song.spotify_url,
      createdAt: song.createdAt,
      updatedAt: song.updatedAt
    };
  }

  /**
   * Convierte un array de documentos Song en un array de respuestas básicas.
   *
   * Utiliza {@link toResponse} para procesar cada canción del array.
   * Si el parámetro no es un array válido, devuelve un array vacío.
   *
   * @static
   * @param {Array} songs Array de documentos Song (Mongoose).
   * @returns {Object[]} Array de canciones formateadas, o array vacío si la entrada es inválida.
   */
  static toResponseBatch(songs) {
    if (!Array.isArray(songs)) return [];
    return songs.map(song => this.toResponse(song));
  }

  /**
   * Convierte un documento de Song en una respuesta detallada con metadatos.
   *
   * Extiende la respuesta básica añadiendo un objeto `metadata` con información
   * calculada sobre la canción:
   * - Número de artistas.
   * - Disponibilidad de preview.
   * - Duración separada en minutos y segundos.
   *
   * Útil para vistas detalladas que requieren más contexto que la respuesta básica.
   *
   * @static
   * @param {Object|null} song Documento de Song (Mongoose).
   * @returns {Object|null} Song con metadatos o `null` si no existe.
   *
   * @example
   * const detailed = SongDTO.toDetailedResponse(song);
   * // { ...basic properties, metadata: { artistCount: 2, hasPreview: true, ... } }
   */
  static toDetailedResponse(song) {
    if (!song) return null;

    const basic = this.toResponse(song);

    return {
      ...basic,
      metadata: {
        artistCount: song.artists?.length || 0,
        hasPreview: !!song.preview_url,
        durationMinutes: Math.floor(song.duration_ms / 60000),
        durationSeconds: Math.floor((song.duration_ms % 60000) / 1000)
      }
    };
  }

  /**
   * Prepara una query de MongoDB para búsqueda de canciones con filtros opcionales.
   *
   * Construye un objeto de query que soporta búsqueda multifield con operadores regex
   * (case-insensitive). Los filtros soportados son:
   * - `search`: Busca en nombre, artista y álbum simultáneamente (OR).
   * - `name`: Busca específica en el nombre de la canción.
   * - `artist`: Busca específica en los artistas.
   * - `album`: Busca específica en el álbum.
   *
   * Si no se proporciona ningún filtro válido, devuelve una query vacía (que matchea todos).
   *
   * @static
   * @param {Object} filters Objeto de filtros para búsqueda.
   * @param {string} [filters.search] Término de búsqueda general (nombre, artista o álbum).
   * @param {string} [filters.name] Búsqueda en nombre de la canción.
   * @param {string} [filters.artist] Búsqueda en artistas.
   * @param {string} [filters.album] Búsqueda en álbum.
   * @returns {Object} Query de MongoDB lista para usar con `.find()`.
   *
   * @example
   * const query = SongDTO.toSearchQuery({ search: 'bohemian' });
   * const songs = await Song.find(query);
   *
   * @example
   * const query = SongDTO.toSearchQuery({ name: 'Rhapsody', artist: 'Queen' });
   * const songs = await Song.find(query);
   */
  static toSearchQuery(filters) {
    const query = {};

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { artists: { $regex: filters.search, $options: 'i' } },
        { album: { $regex: filters.search, $options: 'i' } }
      ];
    }

    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }

    if (filters.artist) {
      query.artists = { $regex: filters.artist, $options: 'i' };
    }

    if (filters.album) {
      query.album = { $regex: filters.album, $options: 'i' };
    }

    return query;
  }
}

module.exports = SongDTO;

