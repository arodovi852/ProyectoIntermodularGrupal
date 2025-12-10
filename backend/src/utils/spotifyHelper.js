/**
 * Utilidades para Trabajar con Datos de Spotify.
 *
 * Proporciona funciones de validación, transformación y utilidades
 * para trabajar con objetos devueltos por la API de Spotify.
 *
 * Funciones principales:
 * - Validación de estructura de tracks
 * - Selección inteligente de imágenes de álbumes
 * - Formateo de duraciones
 * - Extracción de IDs desde URLs/URIs
 * - Conversión de parámetros de "mood" a parámetros de API
 *
 * @module utils/spotifyHelper
 */

/**
 * Valida si un objeto tiene la estructura correcta de un track de Spotify.
 *
 * Verifica la presencia y estructura de:
 * - Campos básicos: id, name, duration_ms
 * - Objeto album con name e images (array)
 * - Array de artists con al menos 1 elemento
 * - Object external_urls con URL de Spotify
 *
 * Útil para validar datos antes de guardarlos en BD.
 *
 * @function isValidSpotifyTrack
 * @param {Object} track - Objeto a validar
 * @returns {boolean} true si tiene estructura válida de track de Spotify
 *
 * @example
 * const spotifyTrack = { id: '...', name: 'Song', ... };
 * if (isValidSpotifyTrack(spotifyTrack)) {
 *   await saveToDB(spotifyTrack);
 * }
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
 * Selecciona la mejor imagen de un álbum según el tamaño preferido.
 *
 * Spotify devuelve imágenes ordenadas de mayor a menor resolución.
 * La función intenta obtener la mejor imagen para el tamaño solicitado,
 * con fallbacks si no está disponible.
 *
 * Tamaños:
 * - 'large': Máxima resolución disponible (índice 0)
 * - 'medium': Resolución intermedia
 * - 'small': Mínima resolución (última)
 *
 * @function getBestAlbumImage
 * @param {Array} images - Array de objetos imagen de Spotify
 * @param {Object} images[].url - URL de la imagen
 * @param {number} images[].height - Altura en píxeles
 * @param {number} images[].width - Ancho en píxeles
 * @param {string} [size='large'] - Tamaño preferido: 'large', 'medium', 'small'
 * @returns {string} URL de la imagen (o placeholder si no hay imágenes)
 *
 * @example
 * const imageUrl = getBestAlbumImage(album.images, 'large');
 * // https://i.scdn.co/image/ab67616d0000b273...
 *
 * @example
 * const smallImage = getBestAlbumImage(album.images, 'small');
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
 * Formatea una duración en milisegundos a formato legible.
 *
 * Formatos:
 * - Sin horas: "3:45" (3 minutos 45 segundos)
 * - Con horas: "1:23:45" (1 hora 23 minutos 45 segundos)
 *
 * @function formatDuration
 * @param {number} durationMs - Duración en milisegundos
 * @param {boolean} [includeHours=false] - Si incluir horas en formato
 * @returns {string} Duración formateada (MM:SS o HH:MM:SS)
 *
 * @example
 * formatDuration(225000); // "3:45" (3 minutos 45 segundos)
 *
 * @example
 * formatDuration(5045000, true); // "1:24:05" (1 hora 24 minutos 5 segundos)
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
 * Extrae IDs de Spotify desde diferentes formatos de entrada.
 *
 * Soporta múltiples formatos:
 * 1. URI: `spotify:track:3n3Ppam7vgaVa1iaRUc9Lp`
 * 2. URL: `https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp`
 * 3. ID directo: `3n3Ppam7vgaVa1iaRUc9Lp`
 * 4. Array: Procesa múltiples y retorna array plano
 *
 * @function extractSpotifyIds
 * @param {string|Array} input - URL, URI, ID directo, o array de cualquiera de estos
 * @returns {Array<string>} Array de IDs extraídos
 *
 * @example
 * extractSpotifyIds('spotify:track:3n3Ppam7vgaVa1iaRUc9Lp');
 * // ['3n3Ppam7vgaVa1iaRUc9Lp']
 *
 * @example
 * extractSpotifyIds('https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp');
 * // ['3n3Ppam7vgaVa1iaRUc9Lp']
 *
 * @example
 * extractSpotifyIds(['spotify:track:id1', 'https://open.spotify.com/track/id2']);
 * // ['id1', 'id2']
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
 * Convierte parámetros de "mood" a parámetros de la API de Spotify/Recomendaciones.
 *
 * Mapea parámetros de interfaz de usuario de "estado de ánimo" a parámetros
 * estándar de Spotify Recommendations API.
 *
 * Parámetros de audio (0-1):
 * - acousticness: Probabilidad de ser acústico
 * - danceability: Qué bailan las personas a esta música
 * - energy: Intensidad y actividad (0.0=calma, 1.0=enérgico)
 * - instrumentalness: Falta de voces
 * - valence: Positividad musical (0.0=triste, 1.0=alegre)
 *
 * @function moodToSpotifyParams
 * @param {Object} mood - Parámetros de estado de ánimo
 * @param {number} [mood.valence] - Positividad (0-1)
 * @param {number} [mood.energy] - Energía (0-1)
 * @param {number} [mood.danceability] - Bailabilidad (0-1)
 * @param {number} [mood.tempo] - Tempo en BPM (0-250)
 * @param {number} [mood.acousticness] - Acústica (0-1)
 * @param {number} [mood.instrumentalness] - Instrumentalidad (0-1)
 * @param {number} [mood.limit] - Límite de resultados
 * @param {string[]} [mood.seed_tracks] - IDs de tracks semilla
 * @param {string[]} [mood.seed_artists] - IDs de artistas semilla
 * @param {string[]} [mood.seed_genres] - Géneros semilla
 * @returns {Object} Parámetros mapeados para Spotify API
 *
 * @example
 * const params = moodToSpotifyParams({
 *   energy: 0.8,
 *   valence: 0.7,
 *   seed_artists: ['artist1', 'artist2']
 * });
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

