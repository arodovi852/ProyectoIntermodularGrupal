/**
 * Utilidades para trabajar con datos de Spotify
 */

/**
 * Valida si un objeto tiene la estructura de un track de Spotify
 *
 * @param {Object} track - Objeto a validar
 * @returns {boolean} True si tiene la estructura correcta
 */
const isValidSpotifyTrack = (track) => {
  if (!track || typeof track !== 'object') return false;

  const requiredFields = [
    'id',
    'name',
    'duration_ms',
    'album',
    'artists',
    'external_urls'
  ];

  for (const field of requiredFields) {
    if (!(field in track)) return false;
  }

  // Validar estructura del álbum
  if (!track.album.name || !track.album.images || !Array.isArray(track.album.images)) {
    return false;
  }

  // Validar artistas
  if (!Array.isArray(track.artists) || track.artists.length === 0) {
    return false;
  }

  // Validar external_urls
  if (!track.external_urls.spotify) {
    return false;
  }

  return true;
};

/**
 * Obtiene la mejor imagen de un álbum de Spotify
 *
 * @param {Array} images - Array de imágenes del álbum
 * @param {string} size - Tamaño preferido: 'large', 'medium', 'small'
 * @returns {string} URL de la imagen
 */
const getBestAlbumImage = (images, size = 'large') => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return 'https://via.placeholder.com/640x640.png?text=No+Image';
  }

  // Spotify devuelve imágenes ordenadas de mayor a menor resolución
  switch (size) {
    case 'large':
      return images[0]?.url || images[images.length - 1]?.url;
    case 'small':
      return images[images.length - 1]?.url || images[0]?.url;
    case 'medium':
    default:
      const middleIndex = Math.floor(images.length / 2);
      return images[middleIndex]?.url || images[0]?.url;
  }
};

/**
 * Formatea la duración en milisegundos a formato legible
 *
 * @param {number} durationMs - Duración en milisegundos
 * @param {boolean} includeHours - Si debe incluir horas
 * @returns {string} Duración formateada
 */
const formatDuration = (durationMs, includeHours = false) => {
  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (includeHours && hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Extrae los IDs de Spotify de diferentes formatos de entrada
 *
 * @param {string|Array} input - URL, URI o array de Spotify
 * @returns {Array<string>} Array de IDs
 */
const extractSpotifyIds = (input) => {
  if (Array.isArray(input)) {
    return input.map(item => extractSpotifyIds(item)).flat();
  }

  if (typeof input !== 'string') {
    return [];
  }

  // Formato URI: spotify:track:3n3Ppam7vgaVa1iaRUc9Lp
  if (input.startsWith('spotify:')) {
    const parts = input.split(':');
    return [parts[parts.length - 1]];
  }

  // Formato URL: https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp
  if (input.includes('spotify.com/')) {
    const match = input.match(/\/track\/([a-zA-Z0-9]+)/);
    return match ? [match[1]] : [];
  }

  // Asumir que es un ID directo
  return [input];
};

/**
 * Convierte parámetros de estado de ánimo a parámetros de Spotify
 *
 * @param {Object} mood - Objeto con parámetros de estado de ánimo
 * @returns {Object} Parámetros para la API de Spotify/ReccoBeats
 */
const moodToSpotifyParams = (mood) => {
  const params = {};

  // Mapeo directo de parámetros
  if (mood.valence !== undefined) params.valence = mood.valence;
  if (mood.energy !== undefined) params.energy = mood.energy;
  if (mood.danceability !== undefined) params.danceability = mood.danceability;
  if (mood.tempo !== undefined) params.tempo = mood.tempo;
  if (mood.acousticness !== undefined) params.acousticness = mood.acousticness;
  if (mood.instrumentalness !== undefined) params.instrumentalness = mood.instrumentalness;

  // Parámetros adicionales
  if (mood.limit !== undefined) params.limit = mood.limit;
  if (mood.seed_tracks !== undefined) params.seed_tracks = mood.seed_tracks;
  if (mood.seed_artists !== undefined) params.seed_artists = mood.seed_artists;
  if (mood.seed_genres !== undefined) params.seed_genres = mood.seed_genres;

  return params;
};

module.exports = {
  isValidSpotifyTrack,
  getBestAlbumImage,
  formatDuration,
  extractSpotifyIds,
  moodToSpotifyParams
};

