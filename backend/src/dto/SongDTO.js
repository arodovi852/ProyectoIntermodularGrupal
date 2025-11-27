/**
 * Data Transfer Object para Song
 * Transforma datos entre capas de la aplicación
 */

const { isValidSpotifyTrack, getBestAlbumImage } = require('../utils/spotifyHelper');

class SongDTO {
  /**
   * Convierte un track de Spotify API al formato de BD
   * @param {Object} spotifyTrack - Track desde Spotify API
   * @returns {Object} Track en formato de nuestro modelo
   * @throws {Error} Si el track no es válido
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
   * Convierte múltiples tracks de Spotify
   * @param {Array} spotifyTracks - Array de tracks de Spotify
   * @returns {Array} Array de tracks en nuestro formato
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
   * Convierte datos de entrada (request) para crear canción
   * @param {Object} data - Datos del request
   * @returns {Object} Datos validados
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
   * Convierte modelo Song a respuesta para frontend
   * @param {Object} song - Documento de Song (Mongoose)
   * @returns {Object} Song formateado para respuesta
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
   * Convierte múltiples documentos a respuesta
   * @param {Array} songs - Array de documentos Song
   * @returns {Array} Array de songs formateados
   */
  static toResponseBatch(songs) {
    if (!Array.isArray(songs)) return [];
    return songs.map(song => this.toResponse(song));
  }

  /**
   * Convierte respuesta con formato extendido (incluye metadatos)
   * @param {Object} song - Documento de Song
   * @returns {Object} Song con información adicional
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
   * Prepara query de búsqueda
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Object} Query de MongoDB
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

