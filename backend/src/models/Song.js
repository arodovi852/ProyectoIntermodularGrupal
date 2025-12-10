/**
 * Modelo de Canción (Song/Track).
 *
 * Representa una canción obtenida de la API de Spotify. Almacena información
 * detallada del track incluyendo metadatos de Spotify, duración, artistas, álbum
 * e imágenes. Utiliza el ID de Spotify como identificador único para evitar duplicados.
 *
 * Campos principales:
 * - **_id**: ID de Spotify (usado como clave primaria).
 * - **name**: Nombre de la canción.
 * - **album**: Nombre del álbum.
 * - **album_image_url**: URL de la portada del álbum.
 * - **artists**: Array de nombres de artistas.
 * - **duration_ms**: Duración en milisegundos.
 * - **preview_url**: URL de preview de 30 segundos (puede ser null).
 * - **spotify_url**: URL directa en Spotify.
 *
 * Índices:
 * - Búsqueda eficiente por nombre, artistas y álbum.
 *
 * Métodos:
 * - `getFormattedDuration()`: Convierte milisegundos a formato mm:ss.
 * - `fromSpotifyTrack()`: Método estático para crear desde API de Spotify.
 *
 * @module models/Song
 * @requires mongoose
 */
const mongoose = require('mongoose');

/**
 * Esquema de Canción para Mongoose.
 *
 * Define la estructura y validaciones de los documentos de canción en MongoDB.
 * Valida URLs, duración y artistas usando validadores personalizados.
 * El ID de Spotify se usa como _id para mantener referencia única con Spotify.
 *
 * @typedef {Object} Song
 * @property {string} _id - ID único de Spotify (no auto-generado).
 * @property {string} name - Nombre de la canción.
 * @property {string} album - Nombre del álbum.
 * @property {string} album_image_url - URL HTTPS de la portada del álbum.
 * @property {string[]} artists - Array con nombres de artistas (mínimo 1).
 * @property {string|null} preview_url - URL HTTPS de preview de 30 segundos.
 * @property {number} duration_ms - Duración en milisegundos (no negativo).
 * @property {string} spotify_url - URL de la canción en Spotify.
 * @property {Date} createdAt - Timestamp automático de creación.
 * @property {Date} updatedAt - Timestamp automático de última actualización.
 */
const songSchema = new mongoose.Schema({
  // Usamos el ID de Spotify como _id para evitar duplicados
  _id: {
    type: String,
    required: [true, 'El ID de Spotify es requerido']
  },
  name: {
    type: String,
    required: [true, 'El nombre de la canción es requerido'],
    trim: true
  },
  album: {
    type: String,
    required: [true, 'El álbum es requerido'],
    trim: true
  },
  album_image_url: {
    type: String,
    required: [true, 'La URL de la portada del álbum es requerida'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Debe ser una URL válida'
    }
  },
  artists: {
    type: [String],
    required: [true, 'Los artistas son requeridos'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Debe haber al menos un artista'
    }
  },
  preview_url: {
    type: String,
    default: null,
    validate: {
      validator: function(v) {
        return v === null || /^https?:\/\/.+/.test(v);
      },
      message: 'Debe ser una URL válida o null'
    }
  },
  duration_ms: {
    type: Number,
    required: [true, 'La duración es requerida'],
    min: [0, 'La duración no puede ser negativa']
  },
  spotify_url: {
    type: String,
    required: [true, 'La URL de Spotify es requerida'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/(open\.)?spotify\.com\/.+/.test(v);
      },
      message: 'Debe ser una URL de Spotify válida'
    }
  }
}, {
  timestamps: true, // Añade createdAt y updatedAt automáticamente
  collection: 'songs'
});

/**
 * Índices de búsqueda para optimizar consultas frecuentes.
 *
 * Estos índices permiten búsquedas eficientes por:
 * - Nombre de la canción
 * - Artistas
 * - Álbum
 *
 * Sin estos índices, las búsquedas con regex harían full collection scans.
 */
// Índices para búsquedas eficientes
songSchema.index({ name: 1 });
songSchema.index({ artists: 1 });
songSchema.index({ album: 1 });

/**
 * Convierte la duración en milisegundos a formato legible (mm:ss).
 *
 * Calcula minutos y segundos a partir de `duration_ms` y retorna
 * una cadena formateada con segundos rellenados con ceros.
 *
 * @memberof Song
 * @instance
 * @method getFormattedDuration
 * @returns {string} Duración formateada en formato "mm:ss".
 *
 * @example
 * const song = await Song.findById(spotifyId);
 * console.log(song.getFormattedDuration()); // "3:45"
 */
// Método para obtener duración en formato legible (mm:ss)
songSchema.methods.getFormattedDuration = function() {
  const minutes = Math.floor(this.duration_ms / 60000);
  const seconds = Math.floor((this.duration_ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Método estático para crear un objeto Song desde la respuesta de la API de Spotify.
 *
 * Mapea los campos de un track de Spotify al formato de documento esperado por
 * el modelo Song. Extrae información del álbum, artistas y URLs necesarias.
 * Útil para normalizar datos al importar tracks de Spotify.
 *
 * @static
 * @memberof Song
 * @param {Object} spotifyTrack Objeto track desde la API de Spotify.
 * @param {string} spotifyTrack.id ID único del track en Spotify.
 * @param {string} spotifyTrack.name Nombre del track.
 * @param {Object} spotifyTrack.album Objeto album con imágenes.
 * @param {Array} spotifyTrack.album.images Array de imágenes (índice 0 es la primera).
 * @param {Array} spotifyTrack.artists Array de objetos artista.
 * @param {string} spotifyTrack.preview_url URL de preview.
 * @param {number} spotifyTrack.duration_ms Duración en ms.
 * @param {Object} spotifyTrack.external_urls URLs externas.
 * @returns {Object} Objeto listo para insertarse en la BD como Song.
 *
 * @example
 * const spotifyTrack = { id: '...', name: 'Bohemian Rhapsody', ... };
 * const songData = Song.fromSpotifyTrack(spotifyTrack);
 * await Song.create(songData);
 */
// Método estático para crear una canción desde la respuesta de Spotify
songSchema.statics.fromSpotifyTrack = function(spotifyTrack) {
  return {
    _id: spotifyTrack.id,
    name: spotifyTrack.name,
    album: spotifyTrack.album.name,
    album_image_url: spotifyTrack.album.images[0]?.url || '',
    artists: spotifyTrack.artists.map(artist => artist.name),
    preview_url: spotifyTrack.preview_url,
    duration_ms: spotifyTrack.duration_ms,
    spotify_url: spotifyTrack.external_urls.spotify
  };
};

const Song = mongoose.model('Song', songSchema);

module.exports = Song;

