/**
 * Modelo de Playlist (Lista de Reproducción).
 *
 * Representa una playlist creada por un usuario con canciones seleccionadas.
 * Almacena metadatos de la playlist, configuración de generación de recomendaciones
 * basada en parámetros de Spotify API, y referencias a las canciones.
 *
 * Campos principales:
 * - **name**: Nombre de la playlist.
 * - **tracks**: Array de IDs de canciones.
 * - **userId**: Referencia al usuario propietario.
 * - **config**: Objeto con parámetros para generación de recomendaciones:
 *   - Semillas (tracks, artistas, géneros) de inicio.
 *   - Parámetros de audio (energía, bailabilidad, acústica, etc.).
 * - **cover_image_url**: URL personalizada de portada.
 * - **spotify_url**: URL compartible en Spotify.
 *
 * Métodos:
 * - `getTotalDuration()`: Calcula duración total de la playlist.
 * - `getTrackCount()`: Retorna número de canciones.
 * - `getCoverImage()`: Obtiene portada personalizada o de canción.
 * - `findByUserId()`: Método estático para obtener playlists de un usuario.
 *
 * @module models/Playlist
 * @requires mongoose
 */
const mongoose = require('mongoose');

/**
 * Esquema de Playlist para Mongoose.
 *
 * Define la estructura y validaciones de los documentos de playlist en MongoDB.
 * Incluye validadores para parámetros de audio (rango 0-1 para métricas, excepto algunos).
 * La configuración almacena parámetros de Spotify Recommendations API.
 *
 * @typedef {Object} Playlist
 * @property {string} name - Nombre de la playlist (1-200 caracteres).
 * @property {string[]} tracks - Array de IDs de canciones (Song._id).
 * @property {string|null} spotify_url - URL compartible de Spotify.
 * @property {ObjectId} userId - ID del usuario propietario (referencia a User).
 * @property {Date} created_at - Fecha de creación manual.
 * @property {string} cover_image_url - URL de imagen de portada (personalizable).
 * @property {Object} config - Configuración de recomendaciones de Spotify.
 * @property {number} config.size - Cantidad de tracks a generar (1-100).
 * @property {string[]} config.seeds - Semillas de recomendación (1-5).
 * @property {string[]} config.negativeSeeds - Semillas negativas a excluir (0-5).
 * @property {number} config.acousticness - Acústica (0-1, null por defecto).
 * @property {number} config.danceability - Bailabilidad (0-1, null por defecto).
 * @property {number} config.energy - Energía (0-1, null por defecto).
 * @property {number} config.instrumentalness - Instrumentalidad (0-1, null por defecto).
 * @property {number} config.key - Clave musical (-1 a 11, null por defecto).
 * @property {number} config.liveness - Energía en vivo (0-1, null por defecto).
 * @property {number} config.loudness - Volumen (-60 a 2, null por defecto).
 * @property {number} config.mode - Modo (0=menor, 1=mayor, null por defecto).
 * @property {number} config.speechiness - Presencia de voz (0-1, null por defecto).
 * @property {number} config.tempo - Tempo en BPM (0-250, null por defecto).
 * @property {number} config.valence - Positividad (0-1, null por defecto).
 * @property {Date} createdAt - Timestamp automático de creación.
 * @property {Date} updatedAt - Timestamp automático de última actualización.
 */
const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la playlist es requerido'],
    trim: true,
    minlength: [1, 'El nombre debe tener al menos 1 caracter'],
    maxlength: [200, 'El nombre no puede exceder 200 caracteres']
  },
  tracks: {
    type: [String], // Array de IDs de canciones (referencias a Song._id)
    default: [],
    validate: {
      validator: function(v) {
        return Array.isArray(v);
      },
      message: 'Tracks debe ser un array'
    }
  },
  spotify_url: {
    type: String,
    default: null,
    validate: {
      validator: function(v) {
        return v === null || /^https?:\/\/(open\.)?spotify\.com\/.+/.test(v);
      },
      message: 'Debe ser una URL de Spotify válida o null'
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del usuario es requerido']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  cover_image_url: {
    type: String,
    default: 'https://via.placeholder.com/640x640.png?text=Playlist',
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Debe ser una URL válida'
    }
  },
  config: {
    size: {
      type: Number,
      min: [1, 'El tamaño mínimo es 1'],
      max: [100, 'El tamaño máximo es 100'],
      required: [true, 'El tamaño es requerido']
    },
    seeds: {
      type: [String],
      required: [true, 'Las semillas son requeridas'],
      validate: {
        validator: function(v) {
          return Array.isArray(v) && v.length >= 1 && v.length <= 5;
        },
        message: 'Debe haber entre 1 y 5 semillas'
      }
    },
    negativeSeeds: {
      type: [String],
      default: [],
      validate: {
        validator: function(v) {
          return Array.isArray(v) && v.length <= 5;
        },
        message: 'Puede haber máximo 5 semillas negativas'
      }
    },
    acousticness: {
      type: Number,
      min: [0, 'El valor mínimo es 0'],
      max: [1, 'El valor máximo es 1'],
      default: null
    },
    danceability: {
      type: Number,
      min: [0, 'El valor mínimo es 0'],
      max: [1, 'El valor máximo es 1'],
      default: null
    },
    energy: {
      type: Number,
      min: [0, 'El valor mínimo es 0'],
      max: [1, 'El valor máximo es 1'],
      default: null
    },
    instrumentalness: {
      type: Number,
      min: [0, 'El valor mínimo es 0'],
      max: [1, 'El valor máximo es 1'],
      default: null
    },
    key: {
      type: Number,
      min: [-1, 'El valor mínimo es -1'],
      max: [11, 'El valor máximo es 11'],
      default: null
    },
    liveness: {
      type: Number,
      min: [0, 'El valor mínimo es 0'],
      max: [1, 'El valor máximo es 1'],
      default: null
    },
    loudness: {
      type: Number,
      min: [-60, 'El valor mínimo es -60'],
      max: [2, 'El valor máximo es 2'],
      default: null
    },
    mode: {
      type: Number,
      min: [0, 'El valor mínimo es 0'],
      max: [1, 'El valor máximo es 1'],
      default: null
    },
    speechiness: {
      type: Number,
      min: [0, 'El valor mínimo es 0'],
      max: [1, 'El valor máximo es 1'],
      default: null
    },
    tempo: {
      type: Number,
      min: [0, 'El valor mínimo es 0'],
      max: [250, 'El valor máximo es 250'],
      default: null
    },
    valence: {
      type: Number,
      min: [0, 'El valor mínimo es 0'],
      max: [1, 'El valor máximo es 1'],
      default: null
    }
  }
}, {
  timestamps: true, // Añade createdAt y updatedAt automáticamente
  collection: 'playlists'
});

/**
 * Índices de búsqueda para optimizar consultas frecuentes.
 *
 * Estos índices permiten búsquedas y ordenamientos eficientes por:
 * - Usuario (para obtener playlists de un usuario).
 * - Fecha de creación (para ordenar por más recientes).
 * - Nombre (para búsquedas por nombre).
 */
// Índices para búsquedas eficientes
playlistSchema.index({ userId: 1 });
playlistSchema.index({ created_at: -1 });
playlistSchema.index({ name: 1 });

/**
 * Calcula la duración total de la playlist en formato legible.
 *
 * Obtiene todas las canciones referenciadas en `this.tracks`, suma sus duraciones
 * y retorna una cadena formateada en horas, minutos y segundos.
 *
 * Formato de salida:
 * - Si hay horas: "2h 15m 30s"
 * - Si hay solo minutos: "45m 30s"
 * - Si hay solo segundos: "30s"
 *
 * @memberof Playlist
 * @instance
 * @async
 * @method getTotalDuration
 * @returns {Promise<string>} Duración total formateada.
 *
 * @example
 * const playlist = await Playlist.findById(playlistId);
 * const duration = await playlist.getTotalDuration();
 * console.log(duration); // "1h 30m 45s"
 */
// Método para obtener la duración total de la playlist
playlistSchema.methods.getTotalDuration = async function() {
  const Song = mongoose.model('Song');
  const songs = await Song.find({ _id: { $in: this.tracks } });
  const totalMs = songs.reduce((sum, song) => sum + song.duration_ms, 0);

  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Retorna el número de canciones en la playlist.
 *
 * Método simple que devuelve la longitud del array `tracks`.
 * Útil para obtener estadísticas sin hacer queries adicionales.
 *
 * @memberof Playlist
 * @instance
 * @method getTrackCount
 * @returns {number} Número de canciones en la playlist.
 *
 * @example
 * const playlist = await Playlist.findById(playlistId);
 * console.log(playlist.getTrackCount()); // 42
 */
// Método para obtener el número de canciones
playlistSchema.methods.getTrackCount = function() {
  return this.tracks.length;
};

/**
 * Obtiene la imagen de portada de la playlist.
 *
 * Devuelve la imagen personalizada si existe y no es la placeholder.
 * Si no hay portada personalizada, obtiene la imagen del primer track.
 * Si no hay canciones, devuelve la URL placeholder por defecto.
 *
 * Comportamiento:
 * - Si `cover_image_url` es personalizada, la devuelve.
 * - Si hay tracks, usa la imagen del álbum del primer track.
 * - Si no hay tracks ni portada personalizada, usa placeholder.
 *
 * @memberof Playlist
 * @instance
 * @async
 * @method getCoverImage
 * @returns {Promise<string>} URL de la imagen de portada.
 *
 * @example
 * const playlist = await Playlist.findById(playlistId);
 * const coverUrl = await playlist.getCoverImage();
 * console.log(coverUrl); // "https://i.scdn.co/image/..."
 */
// Método para obtener la portada (usa la primera canción o una por defecto)
playlistSchema.methods.getCoverImage = async function() {
  if (this.cover_image_url && this.cover_image_url !== 'https://via.placeholder.com/640x640.png?text=Playlist') {
    return this.cover_image_url;
  }

  if (this.tracks.length > 0) {
    const Song = mongoose.model('Song');
    const firstSong = await Song.findById(this.tracks[0]);
    return firstSong?.album_image_url || this.cover_image_url;
  }

  return this.cover_image_url;
};

/**
 * Método estático para obtener todas las playlists de un usuario.
 *
 * Realiza una búsqueda por `userId` y ordena las playlists de más reciente
 * a más antigua basándose en `created_at`.
 *
 * @static
 * @memberof Playlist
 * @param {string|ObjectId} userId ID del usuario propietario.
 * @returns {Promise<Object[]>} Array de documentos Playlist del usuario.
 *
 * @example
 * const userPlaylists = await Playlist.findByUserId(userId);
 * console.log(userPlaylists.length); // número de playlists del usuario
 */
// Método estático para obtener playlists de un usuario
playlistSchema.statics.findByUserId = function(userId) {
  return this.find({ userId }).sort({ created_at: -1 });
};

/**
 * Middleware pre-hook para queries find.
 *
 * Se ejecuta antes de cualquier operación find. Actualmente no realiza
 * populate automático de tracks para evitar consultas pesadas.
 * El populate se puede hacer manualmente cuando sea necesario llamando
 * a `.populate('tracks')` en la query.
 *
 * @see https://mongoosejs.com/docs/middleware.html
 */
// Populate automático de tracks al hacer queries
playlistSchema.pre(/^find/, function(next) {
  // No hacer populate por defecto para evitar consultas pesadas
  // Se puede hacer manualmente cuando sea necesario: .populate('tracks')
  next();
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;

