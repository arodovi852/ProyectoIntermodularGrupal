const mongoose = require('mongoose');

/**
 * Esquema de Playlist
 * Almacena las playlists creadas por los usuarios
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
<<<<<<< HEAD
=======
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
>>>>>>> dev
  }
}, {
  timestamps: true, // Añade createdAt y updatedAt automáticamente
  collection: 'playlists'
});

// Índices para búsquedas eficientes
playlistSchema.index({ userId: 1 });
playlistSchema.index({ created_at: -1 });
playlistSchema.index({ name: 1 });

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

// Método para obtener el número de canciones
playlistSchema.methods.getTrackCount = function() {
  return this.tracks.length;
};

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

// Método estático para obtener playlists de un usuario
playlistSchema.statics.findByUserId = function(userId) {
  return this.find({ userId }).sort({ created_at: -1 });
};

// Populate automático de tracks al hacer queries
playlistSchema.pre(/^find/, function(next) {
  // No hacer populate por defecto para evitar consultas pesadas
  // Se puede hacer manualmente cuando sea necesario: .populate('tracks')
  next();
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;

